import { resolve } from 'path'
import { launch } from 'puppeteer'
import { toMatchImageSnapshot } from 'jest-image-snapshot'
import next from 'next'

import docs from '../pages/docs.json'

expect.extend({ toMatchImageSnapshot })
jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000

const removeAnimations = `
  * {
    -webkit-animation: unset !important;
    animation: unset !important;
  }
`

const PORT = process.env.PORT || 12345
let browser
let app

describe('Pages', () => {
  beforeAll(async () => {
    app = next({
      dir: '.',
      dev: true,
      quiet: true,
      conf: {}
    })

    await Promise.all([
      launch().then(_browser => {
        browser = _browser
      }),
      app.start(PORT, 'localhost')
    ])
  })

  afterAll(async () => {
    await browser.close()
    await app.close()
  })

  const registerScreenshotTest = (title = '', pathname = '/') => {
    it(`renders ${title} page correctly`, async () => {
      const page = await browser.newPage()
      const pageUrl = `http://localhost:${PORT}${pathname}`
      await page.setRequestInterceptionEnabled(true);

      page.on('request', req => {
        if (req.url !== pageUrl && !req.url.endsWith('fonts.css')) {
          req.abort()
        } else {
          req.continue()
        }
      })

      await page.setViewport({ width: 600, height: 400 })
      await page.goto(pageUrl)
      await page.addStyleTag({ content: removeAnimations })

      const screenshot = await page.screenshot({
        fullPage: true
      })

      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier: title,
        customSnapshotsDir: resolve(__dirname, '__image_snapshots__')
      })

      await page.close()
    })
  }

  for (const docPage of docs.pages) {
    registerScreenshotTest(docPage.title, `/docs/${docPage.pathname}`)
  }
})
