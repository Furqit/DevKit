class Sidebar {
  constructor() {
    this.sidebar = document.querySelector('.sidebar');
    this.navItems = document.querySelectorAll('.nav-item');
    this.currentToolId = null;
    
    this.init();
  }
  
  init() {
    // Navigation item click handlers
    this.navItems.forEach(item => {
      item.addEventListener('click', () => {
        const toolId = item.dataset.tool;
        this.setActiveTool(toolId);
      });
    });
  }
  
  setActiveTool(toolId) {
    if (this.currentToolId === toolId) return;
    
    // Update navigation state
    this.navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.tool === toolId);
    });
    
    this.currentToolId = toolId;
    
    // Dispatch custom event for tool switching
    const event = new CustomEvent('toolChanged', {
      detail: { toolId }
    });
    document.dispatchEvent(event);
    
    // Update URL hash for bookmarking/sharing
    history.pushState({}, '', `#${toolId}`);
  }
  
  // Get active tool ID from URL or default to first tool
  getInitialToolId() {
    const hash = window.location.hash.slice(1);
    if (hash && Array.from(this.navItems).some(item => item.dataset.tool === hash)) {
      return hash;
    }
    return this.navItems[0].dataset.tool;
  }
  
  // Initialize with the correct tool
  activateInitialTool() {
    const initialToolId = this.getInitialToolId();
    this.setActiveTool(initialToolId);
  }
}

// Export for use in main.js
export default Sidebar;