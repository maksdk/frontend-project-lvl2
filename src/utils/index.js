// @ts-check

const sortDifferencesMutable = (arr) => {
  arr.sort((a, b) => {
    if (a.children) sortDifferencesMutable(a.children);
    if (b.children) sortDifferencesMutable(b.children);
    if (a.key > b.key) return 1;
    if (a.key < b.key) return -1;
    return 0;
  });
};

export default sortDifferencesMutable;
