"use strict";

const posts = [
  { likedBy: [1, 3, 5, 2, 3, 123], disLikedBy: [13, 32, 2] },
  { likedBy: [1, 3, 5, 2, 3, 123], disLikedBy: [13, 3, 5, 2] },
  { likedBy: [1, 3, 5, 2, 3], disLikedBy: [13, 5, 2] },
  { likedBy: [1, 3, 5, 2, 3, 123], disLikedBy: [13, 3, 5, 2] },
  { likedBy: [1, 123], disLikedBy: [13, 3, 5, 2] },
  { likedBy: [1, 3, 5, 2, 3, 123], disLikedBy: [13, 323233, 5, 2] },
  {
    likedBy: [1, 31, 123, 123, 123, 123, 123, 123, 5, 22222, 3, 123],
    disLikedBy: [13, 3, 5, 2],
  },
];
const allPosts = posts;
const allPostsSorted = allPosts.sort(
  (a, b) =>
    a.likedBy.length -
    a.disLikedBy.length -
    (b.likedBy.length - b.disLikedBy.length)
);
const topSixPosts = allPostsSorted.splice(0, allPosts.length - 1);
for (const e of topSixPosts) {
  e.score = e.likedBy.length - e.disLikedBy.length;
}
console.log(topSixPosts.reverse());
