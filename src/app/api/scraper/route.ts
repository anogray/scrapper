import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

const chromiumBlob = "https://scrapper-bay.vercel.app/chromium-v127.0.0-pack.tar"

export async function POST(request:any) {

    let browser;
    try{

        const { url } = await request.json();
        console.log({url})
        // return Response.json({ status: true });
    
    
      await chromium.font(
        "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
      );
    
      const isLocalChrome = !!process.env.CHROME_EXECUTABLE_PATH;
    
      browser = await puppeteer.launch({
        args: isLocalChrome ? puppeteer.defaultArgs() : [...chromium.args, '--hide-scrollbars', '--incognito', '--nosandbox'],
        // args: [
        //     ...chromium.args, 
        //     '--disable-setuid-sandbox', 
        //     '--no-sandbox', 
        //     '--disable-gpu', 
        //     '--no-zygote',
        //     '--disable-dev-shm-usage'
        //   ],
        // args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: isLocalChrome
          ? process.env.CHROME_EXECUTABLE_PATH
          : await chromium.executablePath(`${chromiumBlob}`), //await chromium.executablePath(`${chromiumBlob}`),
        //   executablePath: await chromium.executablePath(`${chromiumBlob}`),
        headless: chromium.headless,
      });
    
      const page = await browser.newPage();
    
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );
    
      // Navigate the page to a URL.
      await page.goto("https://instavideosave.net/");
    
      // Set screen size.
      await page.setViewport({ width: 1920, height: 1920 });
    
      await page.type(
        'input[type="Url"]',
        url
      );
    
      await page.waitForSelector('button[type="submit"]', { visible: true });
      await page.click('button[type="submit"]');
        
    //   let hrefs = await page.$$eval('a', alinks=>alinks.map(ele=>ele.href))
    
    //   console.log("mid", {hrefs});
    
    //   const content = await page.content();
      // console.log(content); // Check the full page content
      console.log("waitForSelector");
    
    //   for(let i=0; i<10; i++){
    //       await page.screenshot({ path: `debug${i}.png`, fullPage: true });
    
    //   }
    
      await page.waitForSelector("div.m-2 a", { visible: true});
    
      let hrefs = await page.$$eval('a', alinks=>alinks.map(ele=>ele.href))
        //   await page.click("div.m-2 a");
      // await page.click();
        
      await browser.close();

      console.log("browser closed.");

    
      return Response.json({ success: true, href:hrefs?.[8] });

    }catch(error:any){
        console.error("Error during scraping:", error);
        return Response.json({ success: false, error: error.message });
    }finally {
        if (browser) {
          await browser.close();
        }
      }
   
}
