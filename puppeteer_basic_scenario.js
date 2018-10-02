const puppeteer = require('puppeteer')
;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  /**
   * @param {boolean} value - Whether to enable request interception.
   * @return {Promise}
   */
  await page.setRequestInterception(true)
  /**
   * @param {string} eventType
   * @param {function} callback
   *  @param {Request} request
   */
  page.on('request', request => {
    request.continue()
  })
  /**
   * @param {string} eventType
   * @param {function} callback
   *  @param {Response} response
   */
  page.on('response', response => {
    /**
     *  @return {Request} - A matching Request object.
     */
    const req = response.request()
  })
  /**
   * @param {string} url -  URL to navigate page to. The url should include scheme, e.g. https://
   * @param {Object} options - Navigation parameters which might have the following properties:
   *   @property {string|Array<string>} [waitUntil = 'load'] - When to consider navigation succeeded, defaults to load.
   * @return {Promise<?Response>} - Promise which resolves to the main resource response.
   */
  await page.goto(url, {
    waitUntil: 'load'
  })
  /**
   @return {Promise<String>} - Gets the full HTML contents of the page, including the doctype.
   */
  await page.content().then(content => {})
  await browser.close()
})()
