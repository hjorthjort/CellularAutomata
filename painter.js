main = function() {
    
    // Create new namespace.
    var ca = {};

    ca.Painter = function() {
        this.canvas = document.getElementById('canvas');
        this.canvas_context = this.canvas.getContext('2d');

        this.Constants_ = {
            ACTUAL_WIDTH_PX: 1000,
            ACTUAL_HEIGHT_PX: 1000,
            CELL_SIDE_PX: 2,
            CELL_DEFAULT_COLOR: 'black',
        };

        this.canvas.width = this.Constants_.ACTUAL_WIDTH_PX;
        this.canvas.height = this.Constants_.ACTUAL_HEIGHT_PX;
    }; // End constructor.

    ca.Painter.prototype.paintCell_ = function(x, y, color) {
        this.canvas_context.fillStyle = this.Constants_.CELL_DEFAULT_COLOR;
        this.canvas_context.fillRect(x, y, 
            this.Constants_.CELL_SIDE_PX, this.Constants_.CELL_SIDE_PX);
    };

    ca.painter = new ca.Painter();
    
    // Expose functions.
    window.paintCell = ca.painter.paintCell_.bind(ca.painter);

}; // End main closure.
main();
