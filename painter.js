main = function() {

    // Create new namespace.
    var ca = {};

    // Painter class.

    ca.Painter = function(opt_width_cells, opt_height_cells) {
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

    ca.Painter.prototype.paintCell_ = function(x, y, color) {
        color = color ? color : this.Constants_.CELL_DEFAULT_COLOR;
        this.canvas_context.fillStyle = color;
        this.canvas_context.fillRect(x, y, 1, 1);
    };

    ca.Painter.prototype.clear = function() {
        this.canvas_context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    ca.Painter.prototype.getCanvasWidth = function() {
        return this.canvas.width;
    }

    ca.Painter.prototype.getCanvasHeight = function() {
        return this.canvas.height;
    }

    // Automaton class.

    ca.Automaton = function(rule, initial_arr) {
        this.state = initial_arr;
        this.rule = rule;
    }

    ca.Automaton.prototype.nextState = function() {
        var newState = [];
        newState.push(0);
        for (var i = 1; i < this.state.length - 1; i++)
            newState.push(this.rule(this.state[i-1], this.state[i], this.state[i+1]));
        newState.push(0);
        this.state = newState;
        return this.state;
    }

    ca.Automaton.prototype.getState = function() {
        return this.state;
    }

    // Create Wolfram rules.

    ca.RuleGenerator = function(rule_number) {
        return function(l, c, r) {
            var state = l * 4 + c * 2 + r;
            return (rule_number >> state) & 1;
        }
    }

    // Simulator program.

    ca.Simulator = function(rule_nbr, width_cells, height_cells, opt_start_cells) {
        this.current_row = 0;
        this.painter = new ca.Painter(width_cells, height_cells);
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
    }

    ca.Simulator.prototype.VALUE_TO_COLOR_MAP = ['white', 'black'];

    ca.Simulator.prototype.paintNext = function() {
        this.paintRow(this.automaton.nextState());
    }

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
    }

    ca.Simulator.prototype.clear = function () {
        this.painter.clear();
        this.current_row = 0;
    }

    ca.Simulator.prototype.simulate = function() {
        while (this.current_row <= this.painter.getCanvasHeight())
            this.paintNext();
    }

    // Exposed functions.
    ca.run = function() {
        var width = document.getElementById('width_cells').value;
        var height = document.getElementById('height_cells').value;
        try {
            var start_cells = document.getElementById('start_cells').value.split(',');
            for (var i in start_cells) {
                start_cells[i] = parseInt(start_cells[i].trim());
                if (start_cells[i] > width)
                    throw new Error("Cell number too high");
            }
            var rule_nbr = document.getElementById('rule_number').value;
            var sim = new ca.Simulator(rule_nbr, width, height, start_cells);
            sim.clear();
            sim.simulate();
        } catch (e) {
            console.error("Invalid start cell value: " + e.message);
        }
    };

    window.ca = ca;

}; // End main closure.
main();
