main = function() {
    
    // Create new namespace.
    var ca = {};

    // Painter class.

    ca.Painter = function() {
        this.canvas = document.getElementById('canvas');
        this.canvas_context = this.canvas.getContext('2d');

        this.Constants_ = {
            CANVAS_WIDTH_PX: 1000,
            CANVAS_HEIGHT_PX: 1000,
            CELL_DEFAULT_COLOR: 'black',
        };

        this.canvas.width = this.Constants_.CANVAS_WIDTH_PX;
        this.canvas.height = this.Constants_.CANVAS_HEIGHT_PX;
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

    ca.painter = new ca.Painter();

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
    
    ca.Simulator = function(length, rule_nbr) {
        this.current_row = 0;
        var initial = [];
        for (var i = 0; i < length; i++) {
            initial.push(0);
        }
        initial[length/2] = 1;
        this.automaton = new ca.Automaton(ca.RuleGenerator(rule_nbr), initial);
        this.max_width = length/2;
    }

    ca.Simulator.prototype.VALUE_TO_COLOR_MAP = ['white', 'black'];

    ca.Simulator.prototype.paintNext = function() {
        this.paintRow(this.automaton.nextState());
    }

    ca.Simulator.prototype.paintRow = function(array) {
        if (this.current_row > this.max_width)
            throw new Error('Automata size overflowed');
        var painted = false;
        var canvas_width = ca.painter.getCanvasWidth();
        for (var i = 0; i < array.length && i <= canvas_width; i++) {
            painted = painted | array[i];
            var color = this.VALUE_TO_COLOR_MAP[array[i]];
            ca.painter.paintCell_(i, this.current_row, color);
        }
        if (painted)
            this.current_row++;
    }

    ca.Simulator.prototype.clear = function () {
        ca.painter.clear();
        this.current_row = 0;
    }

    // Exposed functions.
    ca.run = function() {
        var width = document.getElementById('width_cells').value;
        var rule_nbr = document.getElementById('rule_number').value;
        var sim = new ca.Simulator(width, rule_nbr);
        for (var i = 0; i < width / 2; i++)
            sim.paintNext();
        // Don't reload page.
        return false;
    };

    window.ca = ca;

}; // End main closure.
main();
