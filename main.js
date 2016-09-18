main = function() {

    // Create new namespace.
    var main = {};

    main.controls = {};

    main.constants = {};
    main.constants.CONTROLS = "controls";
    main.constants.CONTROLS_PREFIX = "control_";
    main.constants.LABELS_PREFIX = "label_";

    main.load_module = function(module) {
        // Clear out old controls.
        main.clear_controls();

        module_namespace = module();
        main.module = module_namespace;
        main.module.load();
    };

    main.run = function() {
        var controls_values = {};
        for (var key in main.controls) {
            controls_values[key] = main.controls[key].value;
        }
        main.module.run(controls_values);
    };

    main.add_control = function(name, label_text, type, opt_default_value) {
        var label_name = main.constants.LABELS_PREFIX + name;
        var control_name = main.constants.CONTROLS_PREFIX + name;
        var label = document.createElement("label");
        label.id = label_name;
        label.for = control_name;
        label.innerHTML = label_text;
        document.getElementById("controls").appendChild(label);

        var input = document.createElement("input");
        input.id = control_name;
        input.type = type;
        input.value = opt_default_value;
        document.getElementById("controls").appendChild(input);
        main.controls[name] = input;
    };

    main.add_control_attribute = function(control_id, attribute, value) {
        control_id = main.constants.CONTROLS_PREFIX + control_id;
        document.getElementById(control_id)[attribute] = value;
    };

    main.clear_controls = function() {
        for (var key in main.controls) {
            var controls = document.getElementById(main.constants.CONTROLS);
            var control_to_delete = document.getElementById(main.constants.CONTROLS_PREFIX + key);
            var label_to_delete = document.getElementById(main.constants.LABELS_PREFIX + key);
            controls.removeChild(control_to_delete);
            controls.removeChild(label_to_delete);
        }
        main.controls = {};
    };

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
    };

    main.Painter.prototype.getCanvasWidth = function() {
        return this.canvas.width;
    };

    main.Painter.prototype.getCanvasHeight = function() {
        return this.canvas.height;
    };

    window.main = main;

}; // End main closure.
main();
