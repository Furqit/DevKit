class Sidebar {
  constructor() {
    this.sidebar = document.querySelector('.sidebar');
    this.mobileToggle = document.querySelector('.mobile-toggle');
    this.navItems = document.querySelectorAll('.nav-item');
    this.currentToolId = null;
    
    this.init();
  }
  
  init() {
    // Mobile sidebar toggle
    this.mobileToggle.addEventListener('click', () => this.toggleMobileSidebar());
    
    // Navigation item click handlers
    this.navItems.forEach(item => {
      item.addEventListener('click', () => {
        const toolId = item.dataset.tool;
        this.setActiveTool(toolId);
        
        // Close sidebar on mobile after selection
        if (window.innerWidth <= 640) {
          this.closeMobileSidebar();
        }
      });
    });
    
    // Handle clicks outside sidebar on mobile to close it
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 640 && 
          !this.sidebar.contains(e.target) && 
          !this.mobileToggle.contains(e.target) &&
          this.sidebar.classList.contains('expanded')) {
        this.closeMobileSidebar();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 640) {
        this.sidebar.classList.remove('expanded');
      }
    });
  }
  
  toggleMobileSidebar() {
    this.sidebar.classList.toggle('expanded');
  }
  
  closeMobileSidebar() {
    this.sidebar.classList.remove('expanded');
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