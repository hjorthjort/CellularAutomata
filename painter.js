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
            CELL_SIDE_PX: 2,
            CELL_DEFAULT_COLOR: 'black',
        };

        this.canvas.width = this.Constants_.CANVAS_WIDTH_PX;
        this.canvas.height = this.Constants_.CANVAS_HEIGHT_PX;
    }; // End constructor.

    ca.Painter.prototype.paintCell_ = function(x, y, color) {
        x = x / this.Constants_.CELL_SIDE_PX;
        y = y / this.Constants_.CELL_SIDE_PX;
        color = color ? color : this.Constants_.CELL_DEFAULT_COLOR;
        this.canvas_context.fillStyle = color;
        this.canvas_context.fillRect(x, y, 
            this.Constants_.CELL_SIDE_PX, this.Constants_.CELL_SIDE_PX);
    };

    ca.Painter.prototype.clear = function() {
        this.canvas_context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

    // Main program.
    
    ca.Main = function(length, rule_nbr) {
        this.current_row = 0;
        var initial = [];
        for (var i = 0; i < length; i++) {
            initial.push(0);
        }
        initial[length/2] = 1;
        this.automaton = new ca.Automaton(ca.RuleGenerator(rule_nbr), initial);
        console.log(initial);
        this.max_width = length/2;
    }

    ca.Main.prototype.VALUE_TO_COLOR_MAP = ['white', 'black'];

    ca.Main.prototype.paintNext = function() {
        this.paintRow(this.automaton.nextState());
    }

    ca.Main.prototype.paintRow = function(array) {
        if (this.current_row > this.max_width)
            throw new Error('Automata size overflowed');
        var x = 0;
        for (var i in array) {
            var color = this.VALUE_TO_COLOR_MAP[array[i]];
            ca.painter.paintCell_(x, this.current_row, color);
            x++;
        }
        this.current_row++;
    }

    ca.Main.prototype.clear = function () {
        ca.painter.clear();
        this.current_row = 0;
    }

    // Expose functions.

    window.ca = ca;

}; // End main closure.
main();
