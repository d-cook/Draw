// Paste "Renderer" code HERE from: https://github.com/d-cook/Render

var r = Renderer('top left', { size: textSize, baseline: 'top' });

var entities = []; // { z, type, filled, closed, color, text, textConfig, args }

var mouse = { x: 0, y: 0, pressed: false, pressedX: 0, pressedY: 0 };
var hoveredItem = [-1, -1];
var selectedItem = [-1, -1];

function entitiesByZ() {
    return entities.sort((a, b) => (a.z || 0) - (b.z || 0));
}

function getContent() {
    return entitiesByZ().map(e =>
        [(e.filled ? 'filled ' : '') + (e.closed ? 'closed ' : '') + (e.color ? e.color+' ' : '') + e.type]
        .concat(typeof e.text === 'string' ? [e.text] : []);
        .concat(e.args)
        .concat(e.textConfig ? [e.textConfig] : []);
    );
}

function getContentWithOverlays() {
    return getContent(); // TODO: Add UI overlays (e.g. drag-handles)
}

function renderContent() {
    r.render(getContentWithOverlays());
}

r.onMouseMove(function mouseMoved(x, y) {
    if (mouse.pressed && selectedItem[0] >= 0) {
        // TODO: Detect whole entity vs points on entity, and type of entity
        entities[selectedItem].x += x - mouse.x;
        entities[selectedItem].y += y - mouse.y;
    }
    mouse.x = x;
    mouse.y = y;
    hoveredItem = entitiesByZ().reduce((h, e) => {
        //TODO: if x && y are over a point of an entity, return [entityIdx, pointIdx]
        return h;
    }, [-1, -1]);
    renderContent();
});

r.onMouseDown(function mouseDown(x, y) {
    mouse.pressed = true;
    mouse.pressedX = x;
    mouse.pressedY = y;
    selectedItem = hoveredItem;
    if (selectedItem[0] >= 0) {
        entities[selectedItem].z = -1;
        entitiesByZ().map((e, i) => e.z = i);
    }
    renderContent();
});

r.onMouseUp(function mouseUp(x, y) {
    mouse.pressed = false;
    renderContent();
});

function fitToWindow() { r.resize(window.innerWidth-4, window.innerHeight-4); }

var c = r.getCanvas();
c.style.border = '2px solid red';
window.addEventListener('resize', fitToWindow);
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.appendChild(c);
fitToWindow();
renderContent();
