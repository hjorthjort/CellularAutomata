ca.tests = {};

// Run all automaton tests
ca.tests.automaton_tests = function() {
    return main.testing.run_tests(ca.tests.automaton_tests.tests, "AutomatonTests");
};

ca.tests.automaton_tests.tests = {};

// Test the correct implementation of the rule generator
ca.tests.automaton_tests.tests.test_rule_generator = function() {
    var aux = function(expected_results, generator) {
        for (var i = 0; i < 8; i++)
            main.testing.assertEqual(expected_results[i], generator(i >> 2, (i >> 1) % 2, i % 2), "Failed on input " + i + ".");
    }
    // Rule 0
    var generator = new main.module.RuleGenerator(0);
    var results = [0, 0, 0, 0, 0, 0, 0, 0];
    aux(results, generator);

    // Rule 30
    var generator = new main.module.RuleGenerator(30);
    var results = [0, 1, 1, 1, 1, 0, 0, 0];
    aux(results, generator);

    // Rule 110
    var generator = new main.module.RuleGenerator(110);
    var results = [0, 1, 1, 1, 0, 1, 1, 0];
    aux(results, generator);

    // Rule 110
    var generator = new main.module.RuleGenerator(250);
    var results = [0, 1, 0, 1, 1, 1, 1, 1];
    aux(results, generator);

    return true;
};

ca.tests.automaton_tests.tests.next_state_test = function() {
    var verify_identical = function(array1, array2) {
        if (array1.length != array2.length)
            return false;
        for (var i = 0; i < array1.length; i++)
            if (array1[i] != array2[i])
                return false;
        return true;
    }
    var rule10correct = [
        [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    ];
    var automaton = new main.module.Automaton(new main.module.RuleGenerator(10), rule10correct[0]);
    for (var i = 0; i < rule10correct.length; i++) {
        if (!verify_identical(rule10correct[i], automaton.getState()))
            return false;
        automaton.nextState();
    }
    return true;
};


// Run all tests.
main.testing.run_module_tests(ca.tests, "Cellular Automata tests");
