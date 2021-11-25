import { IRowElement } from "../../../interface/Row"
import { Draw } from "../Draw"

export class TextParticle {

  private draw: Draw
  private ctx: CanvasRenderingContext2D
  private curX: number
  private curY: number
  private text: string
  private curStyle: string
  private curColor?: string

  constructor(draw: Draw) {
    this.draw = draw
    this.ctx = draw.getCtx()
    this.curX = -1
    this.curY = -1
    this.text = ''
    this.curStyle = ''
  }

  public complete() {
    this._render()
    this.text = ''
  }

  public record(element: IRowElement, x: number, y: number) {
    // 主动完成的重设起始点
    if (!this.text) {
      this._setCurXY(x, y)
    }
    // 样式发生改变
    if (
      (this.curStyle && element.style !== this.curStyle) ||
      (element.color !== this.curColor)
    ) {
      this.complete()
      this._setCurXY(x, y)
    }
    this.text += element.value
    this.curStyle = element.style
    this.curColor = element.color
  }

  private _setCurXY(x: number, y: number) {
    this.curX = x
    this.curY = y
  }

  private _render() {
    if (!this.text || !~this.curX || !~this.curX) return
    this.ctx = this.draw.getCtx()
    this.ctx.save()
    this.ctx.font = this.curStyle
    if (this.curColor) {
      this.ctx.fillStyle = this.curColor
    }
    this.ctx.fillText(this.text, this.curX, this.curY)
    this.ctx.restore()
  }

}