class TestUtils {
  
  static async dragAndDrop(page, sourceLocator, targetLocator) {
    const sourceBox = await sourceLocator.boundingBox();
    const targetBox = await targetLocator.boundingBox();

    if (!sourceBox || !targetBox) {
      throw new Error('Element bounding box not found for drag and drop');
    }

    await page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 15 }
    );
    await page.mouse.up();

    await page.waitForTimeout(500);
  }

}

module.exports = { TestUtils };
