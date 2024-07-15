export const fixLockedNodeWhileDragging =  {
    getDefaultCfg() {
      return {
        direction: 'both',
      };
    },
    getEvents() {
      return {
        'canvas:mousedown': 'onMouseDown',
        'canvas:mousemove': 'onMouseMove',
        'canvas:mouseup': 'onMouseUp',
        'canvas:click': 'onMouseUp',
        'canvas:mouseleave': 'onOutOfRange',
        keyup: 'onKeyUp',
        keydown: 'onKeyDown',
      };
    },
    updateViewport(e) {
      const origin = this.origin;
      const clientX = +e.clientX;
      const clientY = +e.clientY;
      if (isNaN(clientX) || isNaN(clientY)) {
        return;
      }
      let dx = clientX - origin.x;
      let dy = clientY - origin.y;
      if (this.get('direction') === 'x') {
        dy = 0;
      } else if (this.get('direction') === 'y') {
        dx = 0;
      }
      this.origin = {
        x: clientX,
        y: clientY,
      };
      // The difference to built-in drag-canvas:
      const lockedNodes = this.graph.findAll('node', (node) => !node.hasLocked());
      lockedNodes.forEach((node) => {
        node.get('group').translate(dx, dy);
      });
    },
    onMouseDown(e) {
      if (this.keydown) {
        return;
      }
  
      this.origin = { x: e.clientX, y: e.clientY };
      this.dragging = false;
    },
    onMouseMove(e) {
      if (this.keydown) {
        return;
      }
  
      e = Util.cloneEvent(e);
      const graph = this.graph;
      if (!this.origin) {
        return;
      }
      if (this.origin && !this.dragging) {
        if (abs(this.origin.x - e.clientX) + abs(this.origin.y - e.clientY) < DRAG_OFFSET) {
          return;
        }
        if (this.shouldBegin(e, this)) {
          e.type = 'dragstart';
          graph.emit('canvas:dragstart', e);
          this.dragging = true;
        }
      }
      if (this.dragging) {
        e.type = 'drag';
        graph.emit('canvas:drag', e);
      }
      if (this.shouldUpdate(e, this)) {
        this.updateViewport(e);
      }
    },
    onMouseUp(e) {
      if (this.keydown) {
        return;
      }
  
      if (!this.dragging) {
        this.origin = null;
        return;
      }
      e = Util.cloneEvent(e);
      const graph = this.graph;
      if (this.shouldEnd(e, this)) {
        this.updateViewport(e);
      }
      e.type = 'dragend';
      graph.emit('canvas:dragend', e);
      this.endDrag();
    },
    endDrag() {
      if (this.dragging) {
        this.origin = null;
        this.dragging = false;
        // Check whether it exists mouseup event outside. Unbind it if it exists.
        const fn = this.fn;
        if (fn) {
          body.removeEventListener('mouseup', fn, false);
          this.fn = null;
        }
      }
    },
    // If user move the mouse out of the canvas when dragging, the drag event might not be ended by releasing the mouse. Thus, listen to the mouseup event ouside the canvas to end it.
    onOutOfRange(e) {
      if (this.dragging) {
        const self = this;
        const canvasElement = self.graph.get('canvas').get('el');
        const fn = (ev) => {
          if (ev.target !== canvasElement) {
            self.onMouseUp(e);
          }
        };
        this.fn = fn;
        body.addEventListener('mouseup', fn, false);
      }
    },
    onKeyDown(e) {
      const code = e.keyCode || e.which;
      if (!code) {
        return;
      }
      if (ALLOW_EVENTS.indexOf(code) > -1) {
        this.keydown = true;
      } else {
        this.keydown = false;
      }
    },
    onKeyUp() {
      this.keydown = false;
    },
  }