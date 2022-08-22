describe('Timelines', () => {
  function createTimeline() {
    return anime.timeline({
      targets: '.target-class',
      delay: function(el, i) { return i * 20 }, // Can be inherited
      endDelay: function(el, i) { return (i + 1) * 10 }, // Can be inherited
      duration: 50, // Can be inherited
      easing: 'easeOutExpo', // Can be inherited
      direction: 'alternate', // Is not inherited
      loop: true // Is not inherited
    })
    .add({
      translateX: 250,
      // override the easing parameter
      // easing: 'spring',
    })
    .add({
      opacity: .5,
      scale: 2
    })
    .add({
      // override the targets parameter
      targets: '#target-id',
      rotate: 180
    })
    .add({
      translateX: 0,
      scale: 1
    });
  }

  // const childTL0 = parameterInheritanceTL.children[0];
  // const childTL1 = parameterInheritanceTL.children[1];
  // const childTL2 = parameterInheritanceTL.children[2];
  // const childTL3 = parameterInheritanceTL.children[3];

  test('Root timeline delay should inherit the main parameters', () => {
    const parameterInheritanceTL = createTimeline();
    expect(parameterInheritanceTL.delay).toBe(0);
  });

  test('Root timeline endDelay should inherit the main parameters', () => {
    const parameterInheritanceTL = createTimeline();
    expect(parameterInheritanceTL.endDelay).toBe(40);
  });

  test('Basic timeline time offsets', () => {
    const tl = anime.timeline({
      targets: '#target-id',
      duration: 10,
    })
    .add({ translateX: 100 })
    .add({ translateX: 200 })
    .add({ translateX: 300 });

    expect(tl.children[0].timelineOffset).toBe(0);
    expect(tl.children[1].timelineOffset).toBe(10);
    expect(tl.children[2].timelineOffset).toBe(20);
    expect(tl.duration).toBe(30);
  });

  test('Abslolute timeline time offsets', () => {
    const tl = anime.timeline({
      targets: '#target-id',
      duration: 10,
    })
    .add({ translateX: 100 }, 50)
    .add({ translateX: 200 }, 25)
    .add({ translateX: 300 }, 100);

    expect(tl.children[0].timelineOffset).toBe(50);
    expect(tl.children[1].timelineOffset).toBe(25);
    expect(tl.children[2].timelineOffset).toBe(100);
    expect(tl.duration).toBe(110);
  });

  test('Relative timeline time offsets', () => {
    const tl = anime.timeline({
      targets: '#target-id',
      duration: 10,
    })
    .add({ translateX: 100 }, '+=20') // 0 + 20 = 20
    .add({ translateX: 200 }, '*=2') // (20 + 10) * 2 = 60
    .add({ translateX: 300 }, '-=50'); // (60 + 10) - 50 = 20

    expect(tl.children[0].timelineOffset).toBe(20);
    expect(tl.children[1].timelineOffset).toBe(60);
    expect(tl.children[2].timelineOffset).toBe(20);
    expect(tl.duration).toBe(70); // 60 + 10
  });

  test('Mixed timeline time offsets types', () => {
    const tl = anime.timeline({
      targets: '#target-id',
      duration: 10,
    })
    .add({ translateX: 100 }, 50)
    .add({ translateX: 200 }, '-=20') // (50 + 10) - 20 = 40
    .add({ translateX: 300 }, 0);

    expect(tl.children[0].timelineOffset).toBe(50);
    expect(tl.children[1].timelineOffset).toBe(40);
    expect(tl.children[2].timelineOffset).toBe(0);
    expect(tl.duration).toBe(60); // 50 + 10
  });

  test('Timeline values', () => {
    const targetEl = document.querySelector('#target-id');
    const tl = anime.timeline({
      targets: targetEl,
      duration: 10,
      easing: 'linear',
    })
    .add({ translateX: 100 })
    .add({ translateX: 200 }, '-=5')
    .add({ translateX: 300 }, '-=5');

    tl.seek(10);
    expect(tl.children[0].animations[0].currentValue).toBe('100px');
    expect(tl.children[1].animations[0].currentValue).toBe('125px');
    expect(tl.children[2].animations[0].currentValue).toBe('125px');
    expect(targetEl.style.transform).toBe('translateX(125px)');
    tl.seek(15);
    expect(tl.children[0].animations[0].currentValue).toBe('100px');
    expect(tl.children[1].animations[0].currentValue).toBe('200px');
    expect(tl.children[2].animations[0].currentValue).toBe('212.5px');
    expect(targetEl.style.transform).toBe('translateX(212.5px)');

    tl.seek(tl.duration);
    expect(targetEl.style.transform).toBe('translateX(300px)');
  });
});