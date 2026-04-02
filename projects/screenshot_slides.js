const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  
  const filePath = 'file:///home/komachi/.openclaw/workspace/openclaw-slide.html';
  await page.goto(filePath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const slides = [];
  let slideNum = 0;

  while (true) {
    const outPath = `/home/komachi/.openclaw/workspace/slide_${String(slideNum).padStart(2,'0')}.png`;
    await page.screenshot({ path: outPath });
    slides.push(outPath);
    console.log(`撮影: ${outPath}`);

    // 次のスライドへ
    const before = await page.evaluate(() => Reveal.getState().indexh);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(600);
    const after = await page.evaluate(() => Reveal.getState().indexh);
    
    if (after === before) break; // 最後のスライド
    slideNum++;
    if (slideNum > 20) break; // 安全装置
  }

  await browser.close();
  console.log(`完了: ${slides.length}枚`);
})();
