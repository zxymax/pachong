import fs from 'fs'
import cheerio from 'cheerio'
import { ICAnalyzer } from './crowller'

interface ICInfo {
  index: number;
  title: string;
}

interface ICResult {
  time: number;
  data: ICInfo[]
}

interface ICContent {
  [propName: number]: ICInfo[]
}


// 负责分析
export default class JorAnalyzer implements ICAnalyzer {
  private static instance: JorAnalyzer

  static getInstance() { // 单例模式
    if (!JorAnalyzer.instance) {
      JorAnalyzer.instance = new JorAnalyzer()
    }

    return JorAnalyzer.instance
  }

  private getJsonInfo(html: string) {
    const $ = cheerio.load(html)
    const item = $('article.hentry p')
    const infos: ICInfo[] = []
    item.map((index, element) => {
      const p = $(element)
      const content = p.text()

      if (content !== '' && index < 10) {
        infos.push({
          index,
          title: content
        })
      }
    })
    return {
      time: new Date().getTime(),
      data: infos
    }
  }

  private generateJsonConent(result: ICResult, filePath: string) {
    let fileContent: ICContent = {}
    if (fs.existsSync(filePath)) { // 如果文件存在
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    fileContent[result.time] = result.data
    return fileContent
  }

  public analyze(html: string, filePath: string) {
    const info = this.getJsonInfo(html)
    const fileContent = this.generateJsonConent(info, filePath)
    return JSON.stringify(fileContent)
  }

  private constructor() {}

}
