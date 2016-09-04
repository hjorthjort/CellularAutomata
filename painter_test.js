// Testing tools
ca.testing = {};

ca.testing.AssertionError = Error;
ca.testing.assert = function(assertion, opt_message) {
    if (!assertion)
        throw new ca.testing.AssertionError(opt_message);
}

ca.testing.assertEqual = function(obj1, obj2, opt_message) {
    if (obj1 != obj2 || (obj1.equals && obj1.equals(obj2)))
        throw new ca.testing.AssertionError(opt_message);
}

// Unit tests
ca.testing.tests = {};

// Run all automaton tests
ca.testing.tests.automaton_tests = function() {
    for (test in ca.testing.tests.automaton_tests)
        ca.testing.tests.automaton_tests[test]();
}

// Test the correct implementation of the rule generator
ca.testing.tests.automaton_tests.test_rule_generator = function() {
    var aux = function(expected_results, generator) {
        for (var i = 0; i < 8; i++)
            ca.testing.assertEqual(expected_results[i], generator(i >> 2, (i >> 1) % 2, i % 2), "Fail");
    }
    // Rule 0
    var generator = new ca.RuleGenerator(0);
    var results = [0, 0, 0, 0, 0, 0, 0, 0];
    aux(results, generator);
    
    // Rule 30
    var generator = new ca.RuleGenerator(30);
    var results = [0, 1, 1, 1, 1, 0, 0, 0];
    aux(results, generator);

    // Rule 110
    var generator = new ca.RuleGenerator(110);
    var results = [0, 1, 1, 1, 0, 1, 1, 0];
    aux(results, generator);

    // Rule 110
    var generator = new ca.RuleGenerator(250);
    var results = [0, 1, 0, 1, 1, 1, 1, 1];
    aux(results, generator);

}

// Run all tests
for (test in ca.testing.tests)
    ca.testing.tests[test]();
