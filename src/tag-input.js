(function (global) {
  const iconTmpl = `
    <svg viewBox="0 0 100 100">
      <line x1="10" y1="10" x2="90" y2="90" stroke-width="20" stroke-linecap="round" />
      <line x1="10" y1="90" x2="90" y2="10" stroke-width="20" stroke-linecap="round" />
    </svg>
  `;

  const key = {
    ENTER: 13,
    ESC: 27,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39,
    TAB: 9,
    DELETE: 46,
  };

  /**
   * TagInput constructor.
   *
   * @constructor
   * @param {HTMLElement} el Container element.
   * @param {object} options Options.
   */
  function TagInput(el, options) {
    if (!el) {
      throw new Error('Element not found.');
    }

    options = options || {};

    this.settings = {
      tags: [],
      prefix: 'tag-input',
      disabled: false,
      name: 'tag-input',
      placeholder: 'Add tags',
      label: 'Tags',
      ariaTag: 'Tag {{TAG}}.',
      ariaEditTag: 'Edit tag.',
      ariaDeleteTag: 'Delete tag {{TAG}}.',
      ariaTagAdded: 'Tag {{TAG}} added.',
      ariaTagUpdated: 'Tag updated to {{TAG}}.',
      ariaTagDeleted: 'Tag {{TAG}} deleted.',
      ariaTagSelected: 'Tag {{TAG}} selected. Press enter to edit, delete to delete.',
      ariaNoTagsSelected: 'No tags selected.',
      ariaInputLabel:
        '{{TAGS}} tags. Use left and right arrow keys to navigate, enter or tab to create, delete to delete tags.',
    };

    for (var setting in options) {
      if (options.hasOwnProperty(setting)) {
        this.settings[setting] = options[setting];
      }
    }

    this.tags = [];
    this.id = rand();
    this.value = '';

    init.call(this, el);
  }

  /**
   * Adds a new tag. Skips 'onTagAdd' callback when running on init.
   *
   * @param {string} str New tag to be added.
   * @param {boolean} init Adding tags on init from settings (see init).
   * @returns {undefined}
   */
  TagInput.prototype.addTag = function (str, init) {
    const { settings } = this;
    const tag = typeof str === 'string' ? sanitize(str) : null;

    if (!tag || this.tags.indexOf(tag) !== -1) {
      return;
    }

    // *** Tag ***
    const tagEl = document.createElement('div');

    tagEl.classList.add(`${settings.prefix}__tag`);
    tagEl.setAttribute('aria-label', settings.ariaTag.replace('{{TAG}}', tag));
    tagEl.dataset.tagValue = tag;

    // *** Tag text ***
    const textEl = document.createElement('span');

    textEl.classList.add(`${settings.prefix}__text`);
    textEl.textContent = tag;
    textEl.setAttribute('aria-hidden', true);
    tagEl.appendChild(textEl);

    if (!settings.disabled) {
      textEl.addEventListener('dblclick', (e) => {
        makeTagEditable.call(this, e.target.parentNode.dataset.tagValue);
      });
    }

    // *** Tag label ***
    const tagEditLabelEl = document.createElement('label');
    const tagId = `tag-id-${rand()}`;

    tagEditLabelEl.htmlFor = tagId;
    tagEditLabelEl.textContent = settings.ariaEditTag;
    tagEditLabelEl.classList.add(`${settings.prefix}__edit-label`);
    tagEditLabelEl.setAttribute('aria-hidden', true);
    visuallyHide(tagEditLabelEl);
    tagEl.appendChild(tagEditLabelEl);

    // *** Tag edit ***
    const tagEditEl = document.createElement('input');
    const handleTagEditKeyup = onTagEditKeyup.bind(this);
    const handleTagEditKeydown = onTagEditKeydown.bind(this);
    const handleTagEditInput = onTagEditInput.bind(this);

    tagEditEl.classList.add(`${settings.prefix}__edit`);
    tagEditEl.setAttribute('tabindex', -1);
    tagEditEl.setAttribute('type', 'text');
    tagEditEl.setAttribute('aria-hidden', true);
    tagEditEl.value = tag;
    tagEditEl.id = tagId;
    tagEl.appendChild(tagEditEl);

    tagEditEl.addEventListener('focus', () => {
      document.addEventListener('keyup', handleTagEditKeyup);
      document.addEventListener('keydown', handleTagEditKeydown);
      document.addEventListener('input', handleTagEditInput);
    });

    tagEditEl.addEventListener('blur', (e) => {
      document.removeEventListener('keyup', handleTagEditKeyup);
      document.removeEventListener('keydown', handleTagEditKeydown);
      document.removeEventListener('input', handleTagEditInput);

      // All clean up is done here to handle the case
      // when user clicks outside of tag-input.
      tagEl.classList.remove(`${settings.prefix}__tag--editable`);
      tagEditEl.setAttribute('aria-hidden', true);
      tagEditLabelEl.setAttribute('aria-hidden', true);

      if (e.target.value !== tagEl.dataset.tagValue) {
        textEl.textContent = tagEl.dataset.tagValue;
        tagEditEl.value = tagEl.dataset.tagValue;
      }

      resetSelected.call(this);
    });

    // *** Remove button ***
    const { inputEl } = this;

    if (!settings.disabled) {
      const removeBtn = document.createElement('button');
      const removeTag = this.removeTag.bind(this);
      const talk = say.bind(this);

      removeBtn.classList.add(`${settings.prefix}__remove`);
      removeBtn.setAttribute('tabindex', -1);
      removeBtn.setAttribute('type', 'button');
      removeBtn.setAttribute('aria-label', settings.ariaDeleteTag.replace('{{TAG}}', tag));
      removeBtn.innerHTML = iconTmpl;
      tagEl.appendChild(removeBtn);

      removeBtn.addEventListener('click', function () {
        const tag = this.parentNode.dataset.tagValue;

        removeTag(tag);
        talk(settings.ariaTagDeleted.replace('{{TAG}}', tag));
        inputEl.focus();
      });

      // *** Close icon ***
      const iconEl = removeBtn.querySelector('svg');
      iconEl.classList.add(`${settings.prefix}__remove-icon`);
    }

    // Add tag
    this.tagInput.insertBefore(tagEl, inputEl);
    this.tags.push(tag);
    setInputValue.call(this);
    updateInputLabel.call(this);

    // Run callback
    if (!init && settings.onTagAdd) {
      settings.onTagAdd(tag, this.tags);
    }
  };

  /**
   * Removes a tag.
   *
   * @param {string} tag Tag.
   * @returns {undefined}
   */
  TagInput.prototype.removeTag = function (tag) {
    const tagEl = getTagEl.call(this, tag);

    if (tagEl) {
      tagEl.remove();
      this.tags = this.tags.filter((t) => t !== tag);
      setInputValue.call(this);
      updateInputLabel.call(this);

      if (this.settings.onTagRemove) {
        this.settings.onTagRemove(tag, this.tags);
      }
    }
  };

  /**
   * Returns an array of tags.
   *
   * @returns {array}
   */
  TagInput.prototype.getTags = function () {
    return this.tags;
  };

  /**
   * Creates HTML elements. Adds event listeners.
   *
   * @param {HTMLElement} el Container element.
   * @returns {undefined}
   */
  function init(el) {
    // *** Container ***
    el.classList.add(`${this.settings.prefix}-container`);

    // *** Label ***
    const labelEl = document.createElement('label');

    labelEl.classList.add(`${this.settings.prefix}-label`);
    labelEl.htmlFor = `${this.settings.prefix}-${this.id}`;
    labelEl.textContent = this.settings.label;

    if (this.settings.hiddenLabel) {
      visuallyHide(labelEl);
    }

    el.appendChild(labelEl);

    // *** Hidden label ***
    // Holds some instructions for screen reader users.
    const labelHiddenEl = document.createElement('span');

    visuallyHide(labelHiddenEl);
    labelEl.appendChild(labelHiddenEl);

    // *** Tag input ***
    const tagInputEl = document.createElement('div');

    tagInputEl.classList.add(this.settings.prefix);
    this.tagInput = tagInputEl;

    if (this.settings.disabled) {
      tagInputEl.classList.add(`${this.settings.prefix}--disabled`);
    }

    el.appendChild(tagInputEl);

    // *** Input ***
    const inputEl = document.createElement('input');
    const inputKeyupHandler = onInputKeyup.bind(this);
    const inputKeydownHandler = onInputKeydown.bind(this);

    inputEl.setAttribute('type', 'text');
    inputEl.setAttribute('placeholder', this.settings.placeholder);
    inputEl.classList.add(`${this.settings.prefix}__input`);
    inputEl.id = `${this.settings.prefix}-${this.id}`;
    this.inputEl = inputEl;
    this.value = this.inputEl.value;

    if (this.settings.disabled) {
      inputEl.setAttribute('disabled', true);
    }

    inputEl.addEventListener('focus', () => {
      document.addEventListener('keyup', inputKeyupHandler);
      document.addEventListener('keydown', inputKeydownHandler);
    });

    inputEl.addEventListener('blur', () => {
      document.removeEventListener('keyup', inputKeyupHandler);
      document.removeEventListener('keydown', inputKeydownHandler);

      resetSelected.call(this);
    });

    this.tagInput.appendChild(inputEl);

    // *** Hidden input (holds tags value) ***
    const _inputEl = document.createElement('input');

    _inputEl.setAttribute('type', 'hidden');
    _inputEl.setAttribute('name', this.settings.name);
    this._inputEl = _inputEl;
    this.tagInput.appendChild(_inputEl);

    // *** Live region ***
    const liveRegionEl = document.createElement('span');

    visuallyHide(liveRegionEl);
    liveRegionEl.id = `${this.settings.prefix}-live-region-${rand()}`;
    el.appendChild(liveRegionEl);

    // *** Tags ***
    this.settings.tags.forEach((tag) => {
      this.addTag(tag, true);
    });

    if (this.settings.onInit) {
      this.settings.onInit(this.tags);
    }
  }

  /**
   * Handles keydowns from on the input element.
   * All "safe" actions handeled here, because it's faster than keyup.
   *
   * @param {event} e Keydown event.
   * @returns {undefined}
   */
  function onInputKeydown(e) {
    switch (e.keyCode) {
      case key.TAB:
      case key.ENTER:
        if (e.target.value || this._selected) {
          e.preventDefault();
        }
        break;

      case key.ARROW_LEFT:
        if (this.tags.length && !e.target.value) {
          const i = this.tags.indexOf(this._selected);
          const last = this.tags[this.tags.length - 1];
          const previous = this.tags[i - 1];

          if (previous) {
            setSelected.call(this, previous);
            say.call(this, this.settings.ariaTagSelected.replace('{{TAG}}', previous));
          } else if (i !== 0) {
            setSelected.call(this, last);
            say.call(this, this.settings.ariaTagSelected.replace('{{TAG}}', last));
          }
        }
        break;

      case key.ARROW_RIGHT:
        if (this.tags.length && !e.target.value) {
          const i = this.tags.indexOf(this._selected);
          const next = this.tags[i + 1];

          if (next && i >= 0) {
            setSelected.call(this, next);
            say.call(this, this.settings.ariaTagSelected.replace('{{TAG}}', next));
          } else if (i === this.tags.length - 1) {
            resetSelected.call(this);
            say.call(this, this.settings.ariaNoTagsSelected);
          }
        }
        break;

      case key.ESC:
        if (this._selected) {
          resetSelected.call(this);
          say.call(this, this.settings.ariaNoTagsSelected);
        }
        break;

      default:
        break;
    }
  }

  /**
   * Handles keyups on the input element.
   *
   * In comparison to keydown, keyup is more accessible, since it gives users
   * a possibility to move cursor away from the element clicked by mistake.
   *
   * @param {event} e Keyup event.
   * @returns {undefined}
   */
  function onInputKeyup(e) {
    if (e.target.value) {
      resetSelected.call(this);
    }

    switch (e.keyCode) {
      case key.ENTER:
        if (e.target.value) {
          this.addTag(e.target.value);
          say.call(this, this.settings.ariaTagAdded.replace('{{TAG}}', e.target.value));
          this.inputEl.value = '';
        } else if (this._selected) {
          makeTagEditable.call(this, this._selected);
        }
        break;

      case key.TAB:
        if (e.target.value) {
          this.addTag(e.target.value);
          say.call(this, this.settings.ariaTagAdded.replace('{{TAG}}', e.target.value));
          this.inputEl.value = '';
        }
        break;

      case key.DELETE:
        if (!this.value) {
          if (this._selected) {
            this.removeTag(this._selected);
            say.call(this, this.settings.ariaTagDeleted.replace('{{TAG}}', this._selected));
            resetSelected.call(this);
          } else if (this.tags.length) {
            const last = this.tags[this.tags.length - 1];

            this.removeTag(last);
            say.call(this, this.settings.ariaTagDeleted.replace('{{TAG}}', last));
            resetSelected.call(this);
          }
        }
        break;

      default:
        break;
    }

    this.value = this.inputEl.value;
  }

  /**
   * Handles keyups for an input element in the tag.
   *
   * @param {event} e Keydown event.
   * @returns {undefined}
   */
  function onTagEditKeydown(e) {
    switch (e.keyCode) {
      // Prevents form submit
      case key.ENTER:
        e.preventDefault();
        break;

      default:
        break;
    }
  }

  /**
   * Handles keyups for an input element in the tag.
   *
   * @param {event} e Keyup event.
   * @returns {undefined}
   */
  function onTagEditKeyup(e) {
    const tagEl = e.target.parentNode;
    const tag = tagEl.dataset.tagValue;

    switch (e.keyCode) {
      case key.ESC:
        this.inputEl.focus();
        break;

      case key.ENTER:
        const value = sanitize(e.target.value);

        if (!value) {
          this.removeTag(tagEl.dataset.tagValue);
          this.inputEl.focus();
          say.call(this, this.settings.ariaTagDeleted.replace('{{TAG}}', tagEl.dataset.tagValue));

          return;
        }

        this.tags = this.tags.map((t) => {
          return t === tag ? value : t;
        });

        setInputValue.call(this);
        say.call(this, this.settings.ariaTagUpdated.replace('{{TAG}}', value));
        tagEl.dataset.tagValue = value;
        this.inputEl.focus();

        if (this.settings.onTagUpdate) {
          this.settings.onTagUpdate(tag, value, this.tags);
        }
        break;

      default:
        break;
    }
  }

  /**
   * Injects a text into a hidden non-editable tag, takes a width from it
   * and sets this width to the editable input element.
   *
   * @param {event} e Input event.
   * @returns {undefined}
   */
  function onTagEditInput(e) {
    const tagEl = e.target.parentNode;
    const textEl = tagEl.querySelector(`.${this.settings.prefix}__text`);
    const editEl = tagEl.querySelector(`.${this.settings.prefix}__edit`);

    textEl.textContent = e.target.value;
    editEl.style.width = `${textEl.getBoundingClientRect().width}px`;
  }

  /**
   * Hides an element visually, but keeps it accessible for screen readers.
   *
   * @param {HTMLElement} el Element.
   * @returns {undefined}
   */
  function visuallyHide(el) {
    el.style.clip = '1px, 1px, 1px, 1px';
    el.style.height = '1px';
    el.style.width = '1px';
    el.style.overflow = 'hidden';
    el.style.position = 'absolute';
    el.style.whiteSpace = 'nowrap';
  }

  /**
   * Prepares tags passed from the input field.
   *
   * @param {string} tag Tag.
   * @returns {string}
   */
  function sanitize(tag) {
    return tag.trim();
  }

  /**
   * Sets a value from tags to the hidden input field.
   *
   * @returns {undefined}
   */
  function setInputValue() {
    this._inputEl.value = JSON.stringify(this.tags);
  }

  /**
   * Forces screen reader to pronounce the phrase.
   * This is a simplified version of https://github.com/Heydon/on-demand-live-region
   *
   * @param {string} phrase Phrase to be said by screen readers.
   * @returns {undefined}
   */
  function say(phrase) {
    const container = this.tagInput.parentNode;
    const oldRegion = container.querySelector(`[id^="${this.settings.prefix}-live-region-"]`);

    if (oldRegion) {
      container.removeChild(oldRegion);
    }

    const newRegion = document.createElement('span');

    newRegion.id = `${this.settings.prefix}-live-region-${rand()}`;
    newRegion.setAttribute('aria-live', 'assertive');
    newRegion.setAttribute('role', 'alert');
    visuallyHide(newRegion);
    container.appendChild(newRegion);
    newRegion.textContent = phrase;
  }

  /**
   * Updates hidden text for screen readers with meta information.
   *
   * @returns {undefined}
   */
  function updateInputLabel() {
    const containerEl = this.tagInput.parentNode;
    const hiddenLabelEl = containerEl.querySelector(`.${this.settings.prefix}-label span`);

    hiddenLabelEl.textContent = `, ${this.settings.ariaInputLabel.replace(
      '{{TAGS}}',
      this.tags.length
    )}`;
  }

  /**
   * Makes a tag editable. Width for input is taken from non-editable span (see onTagEditInput).
   *
   * @param {string} tag Tag.
   * @returns {undefined}
   */
  function makeTagEditable(tag) {
    const tagEl = getTagEl.call(this, tag);
    const textEl = tagEl.querySelector(`.${this.settings.prefix}__text`);
    const editEl = tagEl.querySelector(`.${this.settings.prefix}__edit`);
    const editLabelEl = tagEl.querySelector(`.${this.settings.prefix}__edit-label`);

    tagEl.classList.add(`${this.settings.prefix}__tag--editable`);
    editEl.style.width = `${textEl.getBoundingClientRect().width}px`;
    editEl.removeAttribute('aria-hidden');
    editLabelEl.removeAttribute('aria-hidden');

    editEl.focus();
  }

  /**
   * Returns a tag element found by passed tag string.
   *
   * @param {string} tag Tag.
   * @returns {HTMLElement}
   */
  function getTagEl(tag) {
    return this.tagInput.querySelector(`[data-tag-value="${tag}"]`);
  }

  /**
   * Sets selected tag.
   *
   * @param {string} tag Tag.
   * @returns {undefined}
   */
  function setSelected(tag) {
    if (this._selected !== tag) {
      resetSelected.call(this);
    }

    const tagEl = getTagEl.call(this, tag);

    if (tagEl) {
      tagEl.classList.add(`${this.settings.prefix}__tag--selected`);
      this._selected = tag;
    }
  }

  /**
   * Resets selected tag.
   *
   * @returns {undefined}
   */
  function resetSelected() {
    const selectedEl = this.tagInput.querySelector(`.${this.settings.prefix}__tag--selected`);

    if (selectedEl) {
      selectedEl.classList.remove(`${this.settings.prefix}__tag--selected`);
    }

    this._selected = null;
  }

  /**
   * Simple random number generator.
   *
   * @returns {number}
   */
  function rand() {
    return Math.floor(Math.random() * 10000);
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = TagInput;
  } else if (typeof define === 'function' && define.amd) {
    define('TagInput', [], function () {
      return TagInput;
    });
  } else if (typeof global === 'object') {
    global.TagInput = TagInput;
  }
})(this);
