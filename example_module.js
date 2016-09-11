example_module = function() {


    var example_namespace = {};

    example_namespace.load = function() {
        // Add controls.
        main.add_control("example_control", "Label text for example control" , "number", 25);
    };

    example_namespace.run = function(controls_values) {
        // Read values from controls.
        var example_value = controls_values["example_control"];

        // Do something meaningful with example value;
    };

    return example_namespace;
};
