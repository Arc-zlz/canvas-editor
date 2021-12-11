import { IElement } from "../../../.."
import { IEditorOption } from "../../../../interface/Editor"
import { Draw } from "../../Draw"

export class TableParticle {

  private options: Required<IEditorOption>

  constructor(draw: Draw) {
    this.options = draw.getOptions()
  }

  private _drawBorder(ctx: CanvasRenderingContext2D, startX: number, startY: number, width: number, height: number) {
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX + width, startY)
    ctx.lineTo(startX + width, startY + height)
    ctx.lineTo(startX, startY + height)
    ctx.closePath()
    ctx.stroke()
  }

  // @ts-ignore
  private _drawRange(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    const { rangeAlpha, rangeColor } = this.options
    ctx.save()
    ctx.globalAlpha = rangeAlpha
    ctx.fillStyle = rangeColor
    ctx.fillRect(x, y, width, height)
    ctx.restore()
  }

  public computeRowColInfo(element: IElement) {
    const { colgroup, trList } = element
    if (!colgroup || !trList) return
    let x = 0
    let y = 0
    for (let t = 0; t < trList.length; t++) {
      const tr = trList[t]
      // 表格最后一行
      const isLastTr = trList.length - 1 === t
      // 当前行最小高度
      let rowMinHeight = 0
      for (let d = 0; d < tr.tdList.length; d++) {
        const td = tr.tdList[d]
        // 计算之前行x轴偏移量
        let offsetXIndex = 0
        if (trList.length > 1 && t !== 0) {
          for (let pT = 0; pT < t; pT++) {
            const pTr = trList[pT]
            // 相同x轴是否存在跨行
            for (let pD = 0; pD < pTr.tdList.length; pD++) {
              const pTd = pTr.tdList[pD]
              const pTdX = pTd.x!
              const pTdY = pTd.y!
              const pTdWidth = pTd.width!
              const pTdHeight = pTd.height!
              // 小于
              if (pTdX < x) continue
              if (pTdX > x) break
              if (pTd.x === x && pTdY + pTdHeight > y) {
                x += pTdWidth
                offsetXIndex += 1
              }
            }
          }
        }
        // 计算格列数
        let colIndex = 0
        const preTd = tr.tdList[d - 1]
        if (preTd) {
          colIndex = preTd.colIndex! + (offsetXIndex || 1)
          if (preTd.colspan > 1) {
            colIndex += preTd.colspan - 1
          }
        } else {
          colIndex += offsetXIndex
        }
        // 计算格宽高
        let width = 0
        for (let col = 0; col < td.colspan; col++) {
          width += colgroup[col + colIndex].width
        }
        let height = 0
        for (let row = 0; row < td.rowspan; row++) {
          height += trList[row + t].height
        }
        // y偏移量
        if (rowMinHeight === 0 || rowMinHeight > height) {
          rowMinHeight = height
        }
        // 当前行最后一个td
        const isLastRowTd = tr.tdList.length - 1 === d
        // 当前列最后一个td
        let isLastColTd = isLastTr
        if (!isLastColTd) {
          if (td.rowspan > 1) {
            const nextTrLength = trList.length - 1 - t
            isLastColTd = td.rowspan - 1 === nextTrLength
          }
        }
        // 当前表格最后一个td
        const isLastTd = isLastTr && isLastRowTd
        td.isLastRowTd = isLastRowTd
        td.isLastColTd = isLastColTd
        td.isLastTd = isLastTd
        // 修改当前格clientBox
        td.x = x
        td.y = y
        td.width = width
        td.height = height
        td.rowIndex = t
        td.colIndex = colIndex
        // 当前列x轴累加
        x += width
        // 一行中的最后td
        if (isLastRowTd && !isLastTd) {
          x = 0
          y += rowMinHeight
        }
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, element: IElement, startX: number, startY: number) {
    const { colgroup, trList } = element
    if (!colgroup || !trList) return
    const { scale } = this.options
    const tableWidth = element.width! * scale
    const tableHeight = element.height! * scale
    ctx.save()
    // 渲染边框
    this._drawBorder(ctx, startX, startY, tableWidth, tableHeight)
    // 渲染表格
    for (let t = 0; t < trList.length; t++) {
      const tr = trList[t]
      for (let d = 0; d < tr.tdList.length; d++) {
        const td = tr.tdList[d]
        const { isLastRowTd, isLastColTd, isLastTd } = td
        const width = td.width! * scale
        const height = td.height! * scale
        const x = td.x! * scale + startX + width
        const y = td.y! * scale + startY
        // 绘制线条
        ctx.beginPath()
        if (isLastRowTd && !isLastTd) {
          // 是否跨行到底
          if (y + height < startY + tableHeight) {
            ctx.moveTo(x, y + height)
            ctx.lineTo(x - width, y + height)
          }
        } else if (isLastColTd && !isLastTd) {
          ctx.moveTo(x, y)
          ctx.lineTo(x, y + height)
        } else if (!isLastRowTd && !isLastColTd && !isLastTd) {
          ctx.moveTo(x, y)
          ctx.lineTo(x, y + height)
          ctx.lineTo(x - width, y + height)
        } else if (isLastTd) {
          // 是否跨列到最右
          if (x + width === startX + tableWidth) {
            ctx.moveTo(x, y)
            ctx.lineTo(x, y + height)
          }
        }
        ctx.stroke()
      }
    }
    ctx.restore()
  }

}