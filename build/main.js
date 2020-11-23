
/**
 * @accessible-components/tag-input - Simple and accessible component for creating tags.
 * @version v0.1.1
 * @link https://github.com/accessible-components/tag-input
 * @copyright 2020 Sergei Kriger, https://sergeikriger.com/
 * @license MIT
 */
var colors = document.getElementById('colors');
var colorsTagInput = new TagInput(colors, {
  tags: ['red', 'green', 'red', 'blue'],
  label: 'Colors',
  placeholder: 'Add colors',

  onTagAdd: function onTagAdd(tag, tags) {
    console.log('onTagAdd', tag, tags);
  },
  onTagRemove: function onTagRemove(tag, tags) {
    console.log('onTagRemove', tag, tags);
  },
  onTagUpdate: function onTagUpdate(oldTag, newTag, tags) {
    console.log('onTagUpdate', oldTag, newTag, tags);
  } });


colors.parentNode.addEventListener('submit', function (e) {
  e.preventDefault();
  console.log('colors:submit', e.target['tag-input'].value);
});

var skills = document.getElementById('skills');
var skillsTagInput = new TagInput(skills, {
  tags: ['javascript', 'css', 'react', 'nodejs'],
  label: 'Skills',
  placeholder: 'Add skills',
  disabled: true,

  onTagAdd: function onTagAdd(tag, tags) {
    console.log('onTagAdd', tag, tags);
  },
  onTagRemove: function onTagRemove(tag, tags) {
    console.log('onTagRemove', tag, tags);
  },
  onTagUpdate: function onTagUpdate(oldTag, newTag, tags) {
    console.log('onTagUpdate', oldTag, newTag, tags);
  } });


var categories = document.getElementById('categories');
var categoriesTagInput = new TagInput(categories, {
  tags: ['traveling', 'cooking'],
  label: 'Categories',
  placeholder: 'Add categories',

  onTagAdd: function onTagAdd(tag, tags) {
    console.log('onTagAdd', tag, tags);
  },
  onTagRemove: function onTagRemove(tag, tags) {
    console.log('onTagRemove', tag, tags);
  },
  onTagUpdate: function onTagUpdate(oldTag, newTag, tags) {
    console.log('onTagUpdate', oldTag, newTag, tags);
  } });