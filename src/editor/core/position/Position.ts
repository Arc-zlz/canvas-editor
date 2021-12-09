import { ElementType } from "../.."
import { ZERO } from "../../dataset/constant/Common"
import { IEditorOption } from "../../interface/Editor"
import { IElementPosition } from "../../interface/Element"
import { ICurrentPosition, IGetPositionByXYPayload } from "../../interface/Position"
import { Draw } from "../draw/Draw"

export class Position {

  private cursorPosition: IElementPosition | null
  private positionList: IElementPosition[]

  private draw: Draw
  private options: Required<IEditorOption>

  constructor(draw: Draw) {
    this.positionList = []
    this.cursorPosition = null

    this.draw = draw
    this.options = draw.getOptions()
  }

  public getPositionList(): IElementPosition[] {
    return this.positionList
  }

  public setPositionList(payload: IElementPosition[]) {
    this.positionList = payload
  }

  public setCursorPosition(position: IElementPosition | null) {
    this.cursorPosition = position
  }

  public getCursorPosition(): IElementPosition | null {
    return this.cursorPosition
  }

  public getPositionByXY(payload: IGetPositionByXYPayload): ICurrentPosition {
    const { x, y, isTable } = payload
    let { elementList, positionList } = payload
    if (!elementList) {
      elementList = this.draw.getElementList()
    }
    if (!positionList) {
      positionList = this.positionList
    }
    const curPageNo = this.draw.getPageNo()
    for (let j = 0; j < positionList.length; j++) {
      const { index, pageNo, coordinate: { leftTop, rightTop, leftBottom } } = positionList[j]
      if (curPageNo !== pageNo) continue
      // 命中元素
      if (leftTop[0] <= x && rightTop[0] >= x && leftTop[1] <= y && leftBottom[1] >= y) {
        let curPostionIndex = j
        const element = elementList[j]
        // 表格被命中
        if (element.type === ElementType.TABLE) {
          for (let t = 0; t < element.trList!.length; t++) {
            const tr = element.trList![t]
            for (let d = 0; d < tr.tdList.length; d++) {
              const td = tr.tdList[d]
              const tablePosition = this.getPositionByXY({
                x,
                y,
                td,
                tablePosition: positionList[j],
                isTable: true,
                elementList: td.value,
                positionList: td.positionList
              })
              if (~tablePosition.index) {
                return {
                  index,
                  isTable: true,
                  trIndex: t,
                  tdIndex: d,
                  tdValueIndex: tablePosition.index
                }
              }
            }
          }
        }
        // 图片区域均为命中
        if (element.type === ElementType.IMAGE) {
          return { index: curPostionIndex, isDirectHit: true, isImage: true }
        }
        // 判断是否在文字中间前后
        if (elementList[index].value !== ZERO) {
          const valueWidth = rightTop[0] - leftTop[0]
          if (x < leftTop[0] + valueWidth / 2) {
            curPostionIndex = j - 1
          }
        }
        return { index: curPostionIndex }
      }
    }
    // 非命中区域
    let isLastArea = false
    let curPostionIndex = -1
    // 判断是否在表格内
    if (isTable) {
      const { td, tablePosition } = payload
      if (td && tablePosition) {
        const { leftTop } = tablePosition.coordinate
        const tdX = td.x! + leftTop[0]
        const tdY = td.y! + leftTop[1]
        const tdWidth = td.width!
        const tdHeight = td.height!
        if (!(tdX < x && x < tdX + tdWidth && tdY < y && y < tdY + tdHeight)) {
          return { index: curPostionIndex }
        }
      }
    }
    // 判断所属行是否存在元素
    const firstLetterList = positionList.filter(p => p.isLastLetter && p.pageNo === curPageNo)
    for (let j = 0; j < firstLetterList.length; j++) {
      const { index, pageNo, coordinate: { leftTop, leftBottom } } = firstLetterList[j]
      if (curPageNo !== pageNo) continue
      if (y > leftTop[1] && y <= leftBottom[1]) {
        const isHead = x < this.options.margins[3]
        // 是否在头部
        if (isHead) {
          const headIndex = positionList.findIndex(p => p.rowNo === firstLetterList[j].rowNo)
          curPostionIndex = ~headIndex ? headIndex : index
        } else {
          curPostionIndex = index
        }
        isLastArea = true
        break
      }
    }
    if (!isLastArea) {
      // 当前页最后一行
      return { index: firstLetterList[firstLetterList.length - 1]?.index || positionList.length - 1 }
    }
    return { index: curPostionIndex }
  }

}