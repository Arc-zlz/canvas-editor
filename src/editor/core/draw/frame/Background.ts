import { Draw } from "../Draw"

export class Background {

  private ctx: CanvasRenderingContext2D

  constructor(draw: Draw) {
    this.ctx = draw.getCtx()
  }

  public render(canvasRect: DOMRect) {
    const { width, height } = canvasRect
    this.ctx.save()
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, width, height)
    this.ctx.restore()
  }

}