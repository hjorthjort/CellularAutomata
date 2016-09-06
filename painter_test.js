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

ca.testing.TestResult = function() {};

ca.testing.run_tests = function(test_collection, opt_name) {
    var register = function(pass_or_fail, test_name, test) {
        if (pass_or_fail == 'pass') {
            passed[test_name] = test;
            passes = true;
        } else if (pass_or_fail == 'fail') {
            failed[test_name] = test;
            fails = true;
        }
    };
    // Run all tests
    var passed = {};
    var failed = {};
    var passes = false;
    var fails = false;
    for (var test_name in test_collection) {
        try {
            var func = test_collection[test_name];
            var res = func();
            if (res instanceof ca.testing.TestResult) {
                if (res.name)
                    test_name = res.name;
                if (res.passed)
                    register('pass', test_name, res.passed);
                if (res.failed)
                    register('fail', test_name, res.failed);
            }
            // Assume res is boolean -> it was regular test.
            else if (res)
                register('pass', test_name, func);
            else
                register('fail', test_name, func);
        } catch (e) {
            register('fail', test_name, func);
        }
    }
    var ret = new ca.testing.TestResult();
    if (opt_name)
        ret.name = opt_name;
    if (passes)
        ret.passed = passed;
    if (fails)
        ret.failed = failed;
    return ret;
}

// Unit tests
ca.testing.tests = {};

// Run all automaton tests
ca.testing.tests.automaton_tests = function() {
    return ca.testing.run_tests(ca.testing.tests.automaton_tests.tests, "AutomatonTests");
};

ca.testing.tests.automaton_tests.tests = {};

// Test the correct implementation of the rule generator
ca.testing.tests.automaton_tests.tests.test_rule_generator = function() {
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

    return true;
};

// Run all tests.
var test_results = ca.testing.run_tests(ca.testing.tests);
if (test_results.passed)
    console.log("Passed " + Object.keys(test_results.passed).length + ": ",
        test_results.passed);
if (test_results.failed)
    console.log("Failed " + Object.keys(test_results.failed).length + " tests:",
        test_results.failed);
if (!test_results.passed && !test_results.failed)
    console.log("No tests were run.");
