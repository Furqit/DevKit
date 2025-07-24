import SidebarManager from './sidebar.js';
import JsonTool from './tool-json.js';
import YamlTool from './tool-yaml.js';
import Base64Tool from './tool-base64.js';
import UuidTool from './tool-uuid.js';

const TOOLS_MAP = {
  'json-tool': JsonTool,
  'yaml-tool': YamlTool,
  'base64-tool': Base64Tool,
  'uuid-tool': UuidTool
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
    
    window.addEventListener('popstate', () => {
      const toolId = this.sidebar.getInitialToolId();
      this.sidebar.setActiveTool(toolId);
    });
  }
  
  activateTool(toolId) {
    const toolSections = document.querySelectorAll('.tool-section');
    toolSections.forEach(section => {
      section.classList.remove('active');
    });
    
    const toolSection = document.getElementById(toolId);
    if (toolSection) {
      toolSection.classList.add('active');
    }
    
    if (!this.toolInstances[toolId] && TOOLS_MAP[toolId]) {
      this.toolInstances[toolId] = new TOOLS_MAP[toolId]();
    }
    
    this.activeToolInstance = this.toolInstances[toolId];
  }
}

const devKitApp = new DevKitApp();