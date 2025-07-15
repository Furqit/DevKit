import SidebarManager from './sidebar.js';
import JsonTool from './tool-json.js';
import YamlTool from './tool-yaml.js';
import Base64Tool from './tool-base64.js';

const TOOLS_MAP = {
  'json-tool': JsonTool,
  'yaml-tool': YamlTool,
  'base64-tool': Base64Tool
};

class DevKitApp {
  constructor() {
    this.sidebar = null;
    this.activeToolInstance = null;
    this.toolInstances = {};
    document.addEventListener('DOMContentLoaded', () => this.init());
  }
  
  init() {
    console.log('Initializing DevKit...');
    this.sidebar = new SidebarManager();
    
    document.addEventListener('toolChanged', (e) => {
      this.activateTool(e.detail.toolId);
    });
    
    this.sidebar.activateInitialTool();
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', () => {
      const toolId = this.sidebar.getInitialToolId();
      this.sidebar.setActiveTool(toolId);
    });
  }
  
  activateTool(toolId) {
    // Hide all tool sections
    const toolSections = document.querySelectorAll('.tool-section');
    toolSections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Show the selected tool section
    const toolSection = document.getElementById(toolId);
    if (toolSection) {
      toolSection.classList.add('active');
    }
    
    // Initialize tool if not already done
    if (!this.toolInstances[toolId] && TOOLS_MAP[toolId]) {
      this.toolInstances[toolId] = new TOOLS_MAP[toolId]();
    }
    
    this.activeToolInstance = this.toolInstances[toolId];
  }
}

const devKitApp = new DevKitApp(); 