import { EDITOR_COMPONENT } from "../../dataset/constant/Editor"
import { EditorComponent } from "../../dataset/enum/Editor"
import { IContextMenuContext, IRegisterContextMenu } from "../../interface/contextmenu/ContextMenu"
import { Draw } from "../draw/Draw"
import { Position } from "../position/Position"
import { RangeManager } from "../range/RangeManager"

interface IRenderPayload {
  contextMenuList: IRegisterContextMenu[];
  left: number;
  top: number;
  parentMenuConatiner?: HTMLDivElement;
}

export class ContextMenu {

  private range: RangeManager
  private position: Position
  private container: HTMLDivElement
  private contextMenuList: IRegisterContextMenu[]
  private contextMenuContainerList: HTMLDivElement[]
  private contextMenuRelationShip: Map<HTMLDivElement, HTMLDivElement>

  constructor(draw: Draw) {
    this.range = draw.getRange()
    this.position = draw.getPosition()
    this.container = draw.getContainer()
    this.contextMenuList = []
    this.contextMenuContainerList = []
    this.contextMenuRelationShip = new Map()
    // 接管菜单权限
    document.addEventListener('contextmenu', this._proxyContextMenuEvent.bind(this))
  }

  private _proxyContextMenuEvent(evt: MouseEvent) {
    const context = this._getContext()
    let renderList: IRegisterContextMenu[] = []
    let isRegisterContextMenu = false
    for (let c = 0; c < this.contextMenuList.length; c++) {
      const menu = this.contextMenuList[c]
      if (menu.isDivider) {
        renderList.push(menu)
      } else {
        const isMatch = menu.when?.(context)
        if (isMatch) {
          renderList.push(menu)
          isRegisterContextMenu = true
        }
      }
    }
    if (isRegisterContextMenu) {
      this.dispose()
      this._render({
        contextMenuList: renderList,
        left: evt.x,
        top: evt.y,
      })
    }
    evt.preventDefault()
  }

  private _getContext(): IContextMenuContext {
    const { startIndex, endIndex } = this.range.getRange()
    // 是否存在焦点
    const editorTextFocus = startIndex !== 0 || endIndex !== 0
    // 是否存在选区
    const editorHasSelection = editorTextFocus && startIndex !== endIndex
    // 是否在表格内
    const positionContext = this.position.getPositionContext()
    const isInTable = positionContext.isTable
    return { editorHasSelection, editorTextFocus, isInTable }
  }

  private _createContextMenuContainer(): HTMLDivElement {
    const contextMenuContainer = document.createElement('div')
    contextMenuContainer.classList.add('contextmenu-container')
    contextMenuContainer.setAttribute(EDITOR_COMPONENT, EditorComponent.CONTEXTMENU)
    this.container.append(contextMenuContainer)
    return contextMenuContainer
  }

  private _render(payload: IRenderPayload): HTMLDivElement {
    const { contextMenuList, left, top, parentMenuConatiner } = payload
    const contextMenuContainer = this._createContextMenuContainer()
    const contextMenuContent = document.createElement('div')
    contextMenuContent.classList.add('contextmenu-content')
    // 直接子菜单
    let childMenuContainer: HTMLDivElement | null = null
    // 父菜单添加子菜单映射关系
    if (parentMenuConatiner) {
      this.contextMenuRelationShip.set(parentMenuConatiner, contextMenuContainer)
    }
    for (let c = 0; c < contextMenuList.length; c++) {
      const menu = contextMenuList[c]
      if (menu.isDivider) {
        // 首尾分隔符不渲染
        if (c !== 0 && c !== contextMenuList.length - 1) {
          const divider = document.createElement('div')
          divider.classList.add('contextmenu-divider')
          contextMenuContent.append(divider)
        }
      } else {
        const menuItem = document.createElement('div')
        menuItem.classList.add('contextmenu-item')
        // 菜单事件
        if (menu.childMenus) {
          menuItem.classList.add('contextmenu-sub-item')
          menuItem.onmouseenter = () => {
            this._setHoverStatus(menuItem, true)
            this._removeSubMenu(contextMenuContainer)
            // 子菜单
            const subMenuRect = menuItem.getBoundingClientRect()
            const left = subMenuRect.left + subMenuRect.width
            const top = subMenuRect.top
            childMenuContainer = this._render({
              contextMenuList: menu.childMenus!,
              left,
              top,
              parentMenuConatiner: contextMenuContainer
            })
          }
          menuItem.onmouseleave = (evt) => {
            // 移动到子菜单选项选中状态不变化
            if (!childMenuContainer || !childMenuContainer.contains(evt.relatedTarget as Node)) {
              this._setHoverStatus(menuItem, false)
            }
          }
        } else {
          menuItem.onmouseenter = () => {
            this._setHoverStatus(menuItem, true)
            this._removeSubMenu(contextMenuContainer)
          }
          menuItem.onmouseleave = () => {
            this._setHoverStatus(menuItem, false)
          }
          menuItem.onclick = () => {
            if (menu.callback) {
              menu.callback()
            }
            this.dispose()
          }
        }
        // 图标
        const icon = document.createElement('i')
        menuItem.append(icon)
        if (menu.icon) {
          icon.classList.add(`contextmenu-${menu.icon}`)
        }
        // 文本
        const span = document.createElement('span')
        span.append(document.createTextNode(menu.name!))
        menuItem.append(span)
        // 快捷方式提示
        if (menu.shortCut) {
          const span = document.createElement('span')
          span.classList.add('shortcut')
          span.append(document.createTextNode(menu.shortCut))
          menuItem.append(span)
        }
        contextMenuContent.append(menuItem)
      }
    }
    contextMenuContainer.append(contextMenuContent)
    contextMenuContainer.style.display = 'block'
    contextMenuContainer.style.left = `${left}px`
    contextMenuContainer.style.top = `${top}px`
    this.contextMenuContainerList.push(contextMenuContainer)
    return contextMenuContainer
  }

  private _removeSubMenu(payload: HTMLDivElement) {
    const childMenu = this.contextMenuRelationShip.get(payload)
    if (childMenu) {
      this._removeSubMenu(childMenu)
      childMenu.remove()
      this.contextMenuRelationShip.delete(payload)
    }
  }

  private _setHoverStatus(payload: HTMLDivElement, status: boolean) {
    if (status) {
      payload.parentNode?.querySelectorAll('.contextmenu-item')
        .forEach(child => child.classList.remove('hover'))
      payload.classList.add('hover')
    } else {
      payload.classList.remove('hover')
    }
  }

  public registerContextMenuList(payload: IRegisterContextMenu[]) {
    this.contextMenuList.push(...payload)
  }

  public dispose() {
    this.contextMenuContainerList.forEach(child => child.remove())
    this.contextMenuContainerList = []
    this.contextMenuRelationShip.clear()
  }

}
