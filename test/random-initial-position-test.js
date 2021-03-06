var tape = require("tape"),
  d3VoronoiMapInitialPositionRandom = require("../build/initial-position-policies/random"),
  d3VoronoiMap = require("../build/d3-voronoi-map");

tape("initial-position-policies/randomPolicy()(...) default test", function (test) {
  var initialPositionRandom = d3VoronoiMapInitialPositionRandom(),
    voronoiMap = d3VoronoiMap.voronoiMap(),
    data = [{
      weight: 1
    }],
    initCoords = initialPositionRandom(data[0], 0, data, voronoiMap);

  test.ok(initCoords[0] > 0);
  test.ok(initCoords[0] < 1);
  test.ok(initCoords[1] > 0);
  test.ok(initCoords[1] < 1);

  test.end();
});

tape("initial-position-policies/randomPolicy()(...) and clipping polygon", function (test) {
  test.test("initial-position-policies/randomPolicy()(...) should depends on clipping polygon", function (test) {
    var initialPositionRandom = d3VoronoiMapInitialPositionRandom(),
      voronoiMap = d3VoronoiMap.voronoiMap().extent([
        [1, 1],
        [2, 2]
      ]),
      data = [{
        weight: 1
      }],
      initCoords = initialPositionRandom(data[0], 0, data, voronoiMap);

    test.ok(initCoords[0] > 1);
    test.ok(initCoords[0] < 2);
    test.ok(initCoords[1] > 1);
    test.ok(initCoords[1] < 2);

    test.end();
  });

  test.test("initial-position-policies/randomPolicy()(...) should handle clipping polygon updates", function (test) {
    var initialPositionRandom = d3VoronoiMapInitialPositionRandom(),
      voronoiMap = d3VoronoiMap.voronoiMap().extent([
        [1, 1],
        [2, 2]
      ]),
      data = [{
        weight: 1
      }],
      initCoords = initialPositionRandom(data[0], 0, data, voronoiMap);

    test.ok(initCoords[0] > 1);
    test.ok(initCoords[0] < 2);
    test.ok(initCoords[1] > 1);
    test.ok(initCoords[1] < 2);

    voronoiMap.extent([
      [2, 2],
      [3, 3]
    ])
    initCoords = initialPositionRandom(data[0], 0, data, voronoiMap);

    test.ok(initCoords[0] > 2);
    test.ok(initCoords[0] < 3);
    test.ok(initCoords[1] > 2);
    test.ok(initCoords[1] < 3);

    test.end();
  });
});

tape("initial-position-policies/randomPolicy()(...) should use expected prng", function (test) {
  var myprng = function () { // not a prng, but do the trick for the test!
    var memo = 0;
    return function () {
      memo += .1;
      return memo;
    }
  };
  var initialPositionRandom = d3VoronoiMapInitialPositionRandom(),
    voronoiMap = d3VoronoiMap.voronoiMap().prng(myprng()),
    data = [{
      weight: 1
    }],
    initCoords = initialPositionRandom(data[0], 0, data, voronoiMap);

  test.equal(initCoords[0], 0.1);
  test.equal(initCoords[1], 0.2);
  test.end();
});