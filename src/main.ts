import './style.css'
import Editor, { ElementType, IElement, RowFlex } from './editor'

window.onload = function () {

  const text = `人民医院门诊病历\n主诉：\n发热三天，咳嗽五天。\n现病史：\n发病前14天内有病历报告社区的旅行时或居住史；发病前14天内与新型冠状病毒感染的患者或无症状感染者有接触史；发病前14天内解除过来自病历报告社区的发热或有呼吸道症状的患者；聚集性发病，2周内在小范围如家庭、办公室、学校班级等场所，出现2例及以上发热或呼吸道症状的病例。\n既往史：\n有糖尿病10年，有高血压2年，有传染性疾病1年。\n体格检查：\nT：36.5℃，P：80bpm，R：20次/分，BP：120/80mmHg；\n辅助检查：\n2020年6月10日，普放：血细胞比容36.50%（偏低）40～50；单核细胞绝对值0.75*10^9/L（偏高）参考值：0.1～0.6；\n门诊诊断：\n1.高血压\n处置治疗：\n1.超声引导下甲状腺细针穿刺术；\n2.乙型肝炎表面抗体测定；\n3.膜式病变细胞采集术、后颈皮下肤层；\n电子签名：【】`
  // 模拟行居中
  const centerText = ['人民医院门诊病历']
  const centerIndex: number[] = centerText.map(c => {
    const i = text.indexOf(c)
    return ~i ? Array(c.length).fill(i).map((_, j) => i + j) : []
  }).flat()
  // 模拟加粗字
  const boldText = ['主诉：', '现病史：', '既往史：', '体格检查：', '辅助检查：', '门诊诊断：', '处置治疗：', '电子签名：']
  const boldIndex: number[] = boldText.map(b => {
    const i = text.indexOf(b)
    return ~i ? Array(b.length).fill(i).map((_, j) => i + j) : []
  }).flat()
  // 模拟颜色字
  const colorText = ['传染性疾病']
  const colorIndex: number[] = colorText.map(b => {
    const i = text.indexOf(b)
    return ~i ? Array(b.length).fill(i).map((_, j) => i + j) : []
  }).flat()
  // 模拟高亮字
  const highlightText = ['血细胞比容']
  const highlightIndex: number[] = highlightText.map(b => {
    const i = text.indexOf(b)
    return ~i ? Array(b.length).fill(i).map((_, j) => i + j) : []
  }).flat()
  // 组合数据
  const data: IElement[] = text.split('').map((value, index) => {
    if (centerIndex.includes(index)) {
      return {
        value,
        size: 32,
        rowFlex: RowFlex.CENTER
      }
    }
    if (boldIndex.includes(index)) {
      return {
        value,
        size: 18,
        bold: true
      }
    }
    if (colorIndex.includes(index)) {
      return {
        value,
        color: 'red',
        size: 16
      }
    }
    if (highlightIndex.includes(index)) {
      return {
        value,
        highlight: '#F2F27F'
      }
    }
    return {
      value,
      size: 16
    }
  })
  data.splice(390, 0, {
    value: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFkAAAAgCAYAAAB5JtSmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQ0SURBVGhD7dhrUSNBFAVgvKACEVjAAhJQgAIUYAABGEAABvgfAdn6UnWou01PppOZhIXNj1P9vo9zH5PK1Waz2V5wWlxIPgMuJJ8Bi0h+fn7eXl9fb29ubrYPDw/dO/8DHh8fu/vB4kym4Orqaofb29vund8OSSbhemewSrugBMnG3vlvw9vb265yn56edmtz/t/f33+5C8MkixQSZSsl9UzLOHUmcwTYAN/Rpl5eXnY+pnIB0Xd3d7s5m3rvDsrkCGszNiQ7r/tr4v39fSc/uipOqRcqufTHBiO78GGdzG5xcLtIFmVde7L9NsvXRo9s84+Pj+79pUAwn5GcD1wIz5r+fYGeJdnjGiF9hwL7iWAcfX19/evtKVHJXrtN8Rf4A3TVczqhrut5i1mSZQgnIriSWtdzP2N+EvIhi3/GWqHWtWXuy2IYbheiKarJZIZknkxyrryc2Utrgal+9S8iScUXIx/3kcxfe/jotcuDezLFlIbARDrzHpytXdKnQr4xyc74Vu9YV5Ih2Q/tT7mDSEYw5ZU4wu3nJx64k/1z9umlUG0hah/JSbC6Jzi5exDJWoTHERoBxu8uf/pT1j3HDkUIJitjbRfRA/iwVzlgy1RCfSF5ili9xj7BUWKs9wJZ3MpditYu+lsc+/PRx53cVF9Pdg/syE9Hb6cS75PkmhUEUFofmTvLGEXKimHueJP9Y3swWQwGLUiA9xEbHKuvgs4pPe1+1myTAKlw81buJ8kigjAXKauXPLQPhEYgJSEYsgdTUR0BmTVgc6C359wcvKGnBrGO8dO5VlD1ZZ519nrBHvrwKVMCas9hgL0YUI2wV98fC4FqCWizzXyqF44A0ZKLHkilgvPs1zbiTuZIdZ414KvqGCKZYx4zple+MSrrJVncAyL02/TOqncJwVMglx5zI4QDZ5WPvBGEcNP+7TlEcqJIAQFGsIdQjmZt7MlYA5yiI3pOQTCQXUm2TuVmXgmewxDJQDgl6deJJoU5y7p9uwZagmu1mCvbNoOOBfkhOf6lRZjzPb8qRjBMMiUhM9GNMZQq5/oRXBP7Mlj/i12A7EMIaJGqDcl8I79+/N1xTvdINQ2TDAQSvI9Md479vdqCHKSFQKAfEmgBqCTDkjaSgOZXQkg2jy1ti0xApnBQJo/0obQRipeQXbN3CmxKGQch5xgki4Efghl/kFqzPD//2DnXIodIRpaoETaXxcmwGNO7N4I2Oyuc6b+xK/tL9IH3kY/E+r1JdST4yM+7VUiuJbuPZHBeHZcNvXtziMMV9mRuvUOX8Vg9IFjRx9dUYM3s2oJyNx9ahFfSWwyRHKHG3nmL2q/mojyFVAWnEdi2Hg7OBXwUCCKr1QEtoe0+/9jI3xqIiuF2QRD0zqcwpfQnge9TVSI4tWrNe79shj98F0xDC0N4bTUVF5LPgAvJJ8dm+wcP2iJuZNdC5QAAAABJRU5ErkJggg==`,
    width: 89,
    height: 32,
    id: 'signature',
    type: ElementType.IMAGE
  })
  // 初始化编辑器
  const container = document.querySelector<HTMLDivElement>('.editor')!
  const instance = new Editor(container, data, {
    margins: [100, 120, 100, 120]
  })
  console.log('编辑器实例: ', instance)

  // 撤销、重做、格式刷、清除格式
  const undoDom = document.querySelector<HTMLDivElement>('.menu-item__undo')!
  undoDom.onclick = function () {
    console.log('undo')
    instance.command.executeUndo()
  }
  const redoDom = document.querySelector<HTMLDivElement>('.menu-item__redo')!
  redoDom.onclick = function () {
    console.log('redo')
    instance.command.executeRedo()
  }
  const painterDom = document.querySelector<HTMLDivElement>('.menu-item__painter')!
  painterDom.onclick = function () {
    console.log('painter')
    instance.command.executePainter()
  }
  document.querySelector<HTMLDivElement>('.menu-item__format')!.onclick = function () {
    console.log('format')
    instance.command.executeFormat()
  }

  // 字体、字体变大、字体变小、加粗、斜体、下划线、删除线、字体颜色、背景色
  const fontDom = document.querySelector<HTMLDivElement>('.menu-item__font')!
  const fontSelectDom = fontDom.querySelector<HTMLDivElement>('.select')!
  const fontOptionDom = fontDom.querySelector<HTMLDivElement>('.options')!
  fontDom.onclick = function () {
    console.log('font')
    fontOptionDom.classList.toggle('visible')
  }
  fontOptionDom.onclick = function (evt) {
    const li = evt.target as HTMLLIElement
    instance.command.executeFont(li.dataset.family!)
  }
  document.querySelector<HTMLDivElement>('.menu-item__size-add')!.onclick = function () {
    console.log('size-add')
    instance.command.executeSizeAdd()
  }
  document.querySelector<HTMLDivElement>('.menu-item__size-minus')!.onclick = function () {
    console.log('size-minus')
    instance.command.executeSizeMinus()
  }
  const boldDom = document.querySelector<HTMLDivElement>('.menu-item__bold')!
  boldDom.onclick = function () {
    console.log('bold')
    instance.command.executeBold()
  }
  const italicDom = document.querySelector<HTMLDivElement>('.menu-item__italic')!
  italicDom.onclick = function () {
    console.log('italic')
    instance.command.executeItalic()
  }
  const underlineDom = document.querySelector<HTMLDivElement>('.menu-item__underline')!
  underlineDom.onclick = function () {
    console.log('underline')
    instance.command.executeUnderline()
  }
  const strikeoutDom = document.querySelector<HTMLDivElement>('.menu-item__strikeout')!
  strikeoutDom.onclick = function () {
    console.log('strikeout')
    instance.command.executeStrikeout()
  }
  const colorControlDom = document.querySelector<HTMLInputElement>('#color')!
  colorControlDom.onchange = function () {
    instance.command.executeColor(colorControlDom!.value)
  }
  const colorDom = document.querySelector<HTMLDivElement>('.menu-item__color')!
  const colorSpanDom = colorDom.querySelector('span')!
  colorDom.onclick = function () {
    console.log('color')
    colorControlDom.click()
  }
  const highlightControlDom = document.querySelector<HTMLInputElement>('#highlight')!
  highlightControlDom.onchange = function () {
    instance.command.executeHighlight(highlightControlDom.value)
  }
  const highlightDom = document.querySelector<HTMLDivElement>('.menu-item__highlight')!
  const highlightSpanDom = highlightDom.querySelector('span')!
  highlightDom.onclick = function () {
    console.log('highlight')
    highlightControlDom?.click()
  }
  // 行布局
  const leftDom = document.querySelector<HTMLDivElement>('.menu-item__left')!
  leftDom.onclick = function () {
    console.log('left')
    instance.command.executeLeft()
  }
  const centerDom = document.querySelector<HTMLDivElement>('.menu-item__center')!
  centerDom.onclick = function () {
    console.log('center')
    instance.command.executeCenter()
  }
  const rightDom = document.querySelector<HTMLDivElement>('.menu-item__right')!
  rightDom.onclick = function () {
    console.log('right')
    instance.command.executeRight()
  }
  const rowMarginDom = document.querySelector<HTMLDivElement>('.menu-item__row-margin')!
  const rowOptionDom = rowMarginDom.querySelector<HTMLDivElement>('.options')!
  rowMarginDom.onclick = function () {
    console.log('row-margin')
    rowOptionDom.classList.toggle('visible')
  }
  rowOptionDom.onclick = function (evt) {
    const li = evt.target as HTMLLIElement
    instance.command.executeRowMargin(Number(li.dataset.rowmargin!))
  }
  // 图片上传、搜索、打印
  const imageDom = document.querySelector<HTMLDivElement>('.menu-item__image')!
  const imageFileDom = document.querySelector<HTMLInputElement>('#image')!
  imageDom.onclick = function () {
    imageFileDom.click()
  }
  imageFileDom.onchange = function () {
    const file = imageFileDom.files?.[0]!
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = function () {
      // 计算宽高
      const image = new Image()
      const value = fileReader.result as string
      image.src = value
      image.onload = function () {
        instance.command.executeImage({
          value,
          width: image.width,
          height: image.height,
        })
        imageFileDom.value = ''
      }
    }
  }
  const collspanDom = document.querySelector<HTMLDivElement>('.menu-item__search__collapse')
  const searchInputDom = document.querySelector<HTMLInputElement>('.menu-item__search__collapse__search input')
  document.querySelector<HTMLDivElement>('.menu-item__search')!.onclick = function () {
    console.log('search')
    collspanDom!.style.display = 'block'
  }
  document.querySelector<HTMLDivElement>('.menu-item__search__collapse span')!.onclick = function () {
    collspanDom!.style.display = 'none'
    searchInputDom!.value = ''
    instance.command.executeSearch(null)
  }
  searchInputDom!.oninput = function () {
    instance.command.executeSearch(searchInputDom?.value || null)
  }
  searchInputDom!.onkeydown = function (evt) {
    if (evt.key === 'Enter') {
      instance.command.executeSearch(searchInputDom?.value || null)
    }
  }
  document.querySelector<HTMLDivElement>('.menu-item__print')!.onclick = function () {
    console.log('print')
    instance.command.executePrint()
  }

  // 内部事件监听
  instance.listener.rangeStyleChange = function (payload) {
    // 富文本
    const curFontDom = fontOptionDom.querySelector<HTMLLIElement>(`[data-family=${payload.font}]`)!
    fontSelectDom.innerText = curFontDom.innerText
    fontOptionDom.querySelectorAll<HTMLLIElement>('li').forEach(li => li.classList.remove('active'))
    curFontDom.classList.add('active')
    payload.bold ? boldDom.classList.add('active') : boldDom.classList.remove('active')
    payload.italic ? italicDom.classList.add('active') : italicDom.classList.remove('active')
    payload.underline ? underlineDom.classList.add('active') : underlineDom.classList.remove('active')
    payload.strikeout ? strikeoutDom.classList.add('active') : strikeoutDom.classList.remove('active')
    if (payload.color) {
      colorDom.classList.add('active')
      colorControlDom.value = payload.color
      colorSpanDom.style.backgroundColor = payload.color
    } else {
      colorDom.classList.remove('active')
      colorControlDom.value = '#000000'
      colorSpanDom.style.backgroundColor = '#000000'
    }
    if (payload.highlight) {
      highlightDom.classList.add('active')
      highlightControlDom.value = payload.highlight
      highlightSpanDom.style.backgroundColor = payload.highlight
    } else {
      highlightDom.classList.remove('active')
      highlightControlDom.value = '#ffff00'
      highlightSpanDom.style.backgroundColor = '#ffff00'
    }
    // 行布局
    leftDom.classList.remove('active')
    centerDom.classList.remove('active')
    rightDom.classList.remove('active')
    if (payload.rowFlex && payload.rowFlex === 'right') {
      rightDom.classList.add('active')
    } else if (payload.rowFlex && payload.rowFlex === 'center') {
      centerDom.classList.add('active')
    } else {
      leftDom.classList.add('active')
    }
    // 行间距
    rowOptionDom.querySelectorAll<HTMLLIElement>('li').forEach(li => li.classList.remove('active'))
    const curRowMarginDom = rowOptionDom.querySelector<HTMLLIElement>(`[data-rowmargin='${payload.rowMargin}']`)!
    curRowMarginDom.classList.add('active')
    // 功能
    payload.undo ? undoDom.classList.remove('no-allow') : undoDom.classList.add('no-allow')
    payload.redo ? redoDom.classList.remove('no-allow') : redoDom.classList.add('no-allow')
    payload.painter ? painterDom.classList.add('active') : painterDom.classList.remove('active')
  }

}