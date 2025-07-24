class Sidebar {
  constructor() {
    this.sidebar = document.querySelector('.sidebar');
    this.navItems = document.querySelectorAll('.nav-item');
    this.currentToolId = null;
    
    this.init();
  }
  
  init() {
    this.navItems.forEach(item => {
      item.addEventListener('click', () => {
        const toolId = item.dataset.tool;
        this.setActiveTool(toolId);
      });
    });
  }
  
  setActiveTool(toolId) {
    if (this.currentToolId === toolId) return;
    
    this.navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.tool === toolId);
    });
    
    this.currentToolId = toolId;
    
    const event = new CustomEvent('toolChanged', {
      detail: { toolId }
    });
    document.dispatchEvent(event);
    
    history.pushState({}, '', `#${toolId}`);
  }
  
  getInitialToolId() {
    const hash = window.location.hash.slice(1);
    if (hash && Array.from(this.navItems).some(item => item.dataset.tool === hash)) {
      return hash;
    }
    return this.navItems[0].dataset.tool;
  }
  
  activateInitialTool() {
    const initialToolId = this.getInitialToolId();
    this.setActiveTool(initialToolId);
  }
}

export default Sidebar;