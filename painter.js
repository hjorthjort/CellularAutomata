main = function() {
    
    // Create new namespace.
    var ca = {};

    // Painter class.

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
    
    // Expose functions.

    window.ca = ca;

}; // End main closure.
main();
