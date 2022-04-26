import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
//import JorAnalyzer from './jorAnalyzer'
import LeeAnalyzer from './leeAnalyzer'

export interface ICAnalyzer {
  analyze: (html: string, filePath: string) => string
}

// 只负责爬取内容
class Crowller {

  private filePath = path.resolve(__dirname, '../data/result.json')


  async getRawHtml() {
    const result = await superagent.get(this.url)
    return result.text
  }


  writeFile(content: string) {
    fs.writeFileSync(this.filePath, JSON.stringify(content))
  }

  async initSpiderProcess() {
    const html = await this.getRawHtml()
    const fileContent = this.analyzer.analyze(html, this.filePath)
    this.writeFile(fileContent)
  }


  constructor(private url: string,  private analyzer: ICAnalyzer) {
    this.initSpiderProcess()
  }
}
const url = 'https://www.ruanyifeng.com/blog/2022/04/weekly-issue-203.html'

//const analyzer = new JorAnalyzer()
const analyzer = new LeeAnalyzer()
new Crowller(url, analyzer)
