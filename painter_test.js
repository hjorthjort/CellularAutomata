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

// Run all tests
for (test in ca.testing.tests)
    ca.testing.tests[test]();
