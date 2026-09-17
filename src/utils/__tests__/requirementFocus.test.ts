import { calculateRequirementScrollOffset } from '../requirementFocus';

describe('required section focus', () => {
  it('centers only requested section', () => {
    expect(calculateRequirementScrollOffset([{ y: 600, height: 200 }], 400, 1200)).toBe(500);
  });

  it('centers the combined missing-section region', () => {
    expect(calculateRequirementScrollOffset([{ y: 300, height: 200 }, { y: 560, height: 180 }], 400, 1000)).toBe(320);
  });

  it('clamps target to scroll bounds', () => {
    expect(calculateRequirementScrollOffset([{ y: 0, height: 100 }], 400, 600)).toBe(0);
    expect(calculateRequirementScrollOffset([{ y: 900, height: 200 }], 400, 1000)).toBe(600);
  });
});
