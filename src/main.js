const colors = document.getElementById('colors');
const colorsTagInput = new TagInput(colors, {
  tags: ['red', 'green', 'red', 'blue'],
  label: 'Colors',
  placeholder: 'Add colors',

  onTagAdd: (tag, tags) => {
    console.log('onTagAdd', tag, tags);
  },
  onTagRemove: (tag, tags) => {
    console.log('onTagRemove', tag, tags);
  },
  onTagUpdate: (oldTag, newTag, tags) => {
    console.log('onTagUpdate', oldTag, newTag, tags);
  },
});

colors.parentNode.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('colors:submit', e.target['tag-input'].value);
});

const skills = document.getElementById('skills');
const skillsTagInput = new TagInput(skills, {
  tags: ['javascript', 'css', 'react', 'nodejs'],
  label: 'Skills',
  placeholder: 'Add skills',
  disabled: true,

  onTagAdd: (tag, tags) => {
    console.log('onTagAdd', tag, tags);
  },
  onTagRemove: (tag, tags) => {
    console.log('onTagRemove', tag, tags);
  },
  onTagUpdate: (oldTag, newTag, tags) => {
    console.log('onTagUpdate', oldTag, newTag, tags);
  },
});

const categories = document.getElementById('categories');
const categoriesTagInput = new TagInput(categories, {
  tags: ['traveling', 'cooking'],
  label: 'Categories',
  placeholder: 'Add categories',

  onTagAdd: (tag, tags) => {
    console.log('onTagAdd', tag, tags);
  },
  onTagRemove: (tag, tags) => {
    console.log('onTagRemove', tag, tags);
  },
  onTagUpdate: (oldTag, newTag, tags) => {
    console.log('onTagUpdate', oldTag, newTag, tags);
  },
});
