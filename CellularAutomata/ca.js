ca = function() {

    var ca = {};

    ca.controls = {};

    ca.controls.WIDTH = 'width_cells';
    ca.controls.HEIGHT = 'height_cells';
    ca.controls.START_CELLS = 'start_cells';
    ca.controls.RULE = 'rule_number';
    // Load function.

    ca.load = function() {
        main.add_control(ca.controls.WIDTH, "Width (number of cells)", "number", 1000);
        main.add_control(ca.controls.HEIGHT, "Height (number of cells)", "number", 1000);
        main.add_control(ca.controls.START_CELLS, "Start cell(s)", "number", 500);
        main.add_control(ca.controls.RULE, "Rule number", "number", 110);
        main.add_control_attribute(ca.controls.RULE, "min-value", "0");
        main.add_control_attribute(ca.controls.RULE, "max-value", "255");
    };

    // Automaton class.

    ca.Automaton = function(rule, initial_arr) {
        this.state = initial_arr;
        this.rule = rule;
    };

    ca.Automaton.prototype.nextState = function() {
        var newState = [];
        newState.push(0);
        for (var i = 1; i < this.state.length - 1; i++)
            newState.push(this.rule(this.state[i-1], this.state[i], this.state[i+1]));
        newState.push(0);
        this.state = newState;
        return this.state;
    };

    ca.Automaton.prototype.getState = function() {
        return this.state;
    };

    // Create Wolfram rules.

    ca.RuleGenerator = function(rule_number) {
        if (rule_number < 0 || rule_number > 255)
            throw new Error("Rule must be between 0 and 255.");
        return function(l, c, r) {
            var state = l * 4 + c * 2 + r;
            return (rule_number >> state) & 1;
        }
    };

    // Simulator program.

    ca.Simulator = function(rule_nbr, width_cells, height_cells, opt_start_cells) {
        this.current_row = 0;
        this.painter = new main.Painter(width_cells, height_cells);
        var initial = [];
        for (var i = 0; i < width_cells; i++) {
            initial.push(0);
        }
        if (!opt_start_cells)
            opt_start_cells = [width_cells/2];
        for (var i in opt_start_cells)
            initial[opt_start_cells[i]] = 1;
        this.automaton = new ca.Automaton(ca.RuleGenerator(rule_nbr), initial);
        this.paintRow(initial);
    };

    ca.Simulator.prototype.VALUE_TO_COLOR_MAP = ['white', 'black'];

    ca.Simulator.prototype.paintNext = function() {
        this.paintRow(this.automaton.nextState());
    };

    ca.Simulator.prototype.paintRow = function(array) {
        if (this.current_row > this.painter.getCanvasHeight())
            throw new Error('Too many rows');
        var painted = false;
        var canvas_width = this.painter.getCanvasWidth();
        for (var i = 0; i < array.length && i <= canvas_width; i++) {
            painted = painted | array[i];
            var color = this.VALUE_TO_COLOR_MAP[array[i]];
            this.painter.paintCell_(i, this.current_row, color);
        }
        if (painted)
            this.current_row++;
    };

    ca.Simulator.prototype.clear = function () {
        this.painter.clear();
        this.current_row = 0;
    };

    ca.Simulator.prototype.simulate = function() {
        while (this.current_row <= this.painter.getCanvasHeight())
            this.paintNext();
    };
    
    // Exposed functions.
    ca.run = function(controls_values) {
        var width = controls_values[ca.controls.WIDTH];
        var height = controls_values[ca.controls.HEIGHT];
        try {
            var start_cells = controls_values[ca.controls.START_CELLS].split(',');
            for (var i in start_cells) {
                start_cells[i] = parseInt(start_cells[i].trim());
                if (start_cells[i] > width)
                    throw new Error("Cell number too high");
            }
            var rule_nbr = controls_values[ca.controls.RULE];
            var sim = new ca.Simulator(rule_nbr, width, height, start_cells);
            sim.clear();
            sim.simulate();
        } catch (e) {
            console.error("Runtime error: " + e.message);
        }
    };

    return ca;
};
