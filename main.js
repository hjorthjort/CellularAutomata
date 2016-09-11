main = function() {

    // Create new namespace.
    var main = {};

    // Painter class.

    main.Painter = function(opt_width_cells, opt_height_cells) {
        this.canvas = document.getElementById('canvas');
        this.canvas_context = this.canvas.getContext('2d');

        this.Constants_ = {
            CANVAS_DEFAULT_WIDTH_PX: 1000,
            CANVAS_DEFAULT_HEIGHT_PX: 1000,
            CELL_DEFAULT_COLOR: 'black',
        };

        var width_cells = opt_width_cells ? opt_width_cells : this.Constants_.CANVAS_DEFAULT_WIDTH_PX;
        var height_cells = opt_height_cells ? opt_height_cells : this.Constants_.CANVAS_DEFAULT_HEIGHT_PX;

        this.canvas.width = width_cells;
        this.canvas.height = height_cells;
        this.canvas.style.height = 100 * (height_cells / width_cells) + "%";
    }; // End constructor.

    main.Painter.prototype.paintCell_ = function(x, y, color) {
        color = color ? color : this.Constants_.CELL_DEFAULT_COLOR;
        this.canvas_context.fillStyle = color;
        this.canvas_context.fillRect(x, y, 1, 1);
    };

    main.Painter.prototype.clear = function() {
        this.canvas_context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    main.Painter.prototype.getCanvasWidth = function() {
        return this.canvas.width;
    }

    main.Painter.prototype.getCanvasHeight = function() {
        return this.canvas.height;
    }

    window.main = main;

}; // End main closure.
main();
