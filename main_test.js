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

ca.testing.assertArrayEqual = function(arr1, arr2, opt_message) {
    if (arr1.length !== arr2.length)
        throw new ca.testing.AssertionError(opt_message);
    for (var i = 0; i < arr1.length; i++)
        ca.testing.assertEqual(arr1[i], arr2[i], opt_message);
}

ca.testing.TestResult = function() {};

ca.testing.run_tests = function(test_collection, opt_name) {
    var register = function(pass_or_fail, test_name, test, opt_message) {
        if (opt_message)
            test = { "test": test, "message": opt_message };
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
            register('fail', test_name, func, e.message);
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
};

// Unit tests
ca.testing.tests = {};

// Unit testing on the test framework.
ca.testing.tests.framework_tests = function() {
    return ca.testing.run_tests(ca.testing.tests.framework_tests.tests, "TestingFrameworkTests")
};

ca.testing.tests.framework_tests.tests = {};

ca.testing.tests.framework_tests.tests.assert_test = function() {
    var return_false_func = function() { return false; }
    // Things that should pass assertion.
    var passes = [true, -1, 1.23, "false", "0", "null", new Object(), Function, ca.testing.tests.framework_tests.tests.assert_test, return_false_func];
    for (var i in passes)
        ca.testing.assert(passes[i]);

    // Things that should not pass
    var fails = [0, false, null, undefined, ""];
    for (var i in fails)
        try {
            ca.testing.assert(fails[i]);
            return false;
        } catch (e) {}
    return true;
};

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

ca.testing.tests.automaton_tests.tests.next_state_test = function() {
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
    var automaton = new ca.Automaton(new ca.RuleGenerator(10), rule10correct[0]);
    for (var i = 0; i < rule10correct.length; i++) {
        if (!verify_identical(rule10correct[i], automaton.getState()))
            return false;
        automaton.nextState();
    }
    return true;
}

// Run all tests.
var global_variables_before = Object.keys(window);

var test_results = ca.testing.run_tests(ca.testing.tests);
if (test_results.passed)
    console.log("Passed " + Object.keys(test_results.passed).length + ": ",
        test_results.passed);
if (test_results.failed)
    console.log("Failed " + Object.keys(test_results.failed).length + " tests:",
        test_results.failed);
if (!test_results.passed && !test_results.failed)
    console.log("No tests were run.");
var global_variables_after = Object.keys(window);
ca.testing.assertArrayEqual(global_variables_before, global_variables_after,
    "The testing has leaked variables to global scope");
