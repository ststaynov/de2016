
// Stylesheet template resides in /gulp/utilities/icons/templates/_icons.scss.swig

@font-face {
  font-family: '{{ fontName }}';

  src: url('{{ fontPath }}/{{ fontName }}/{{ fontName }}.eot');
  src: url('{{ fontPath }}/{{ fontName }}/{{ fontName }}.eot?#iefix') format('embedded-opentype'),
    url('{{ fontPath }}/{{ fontName }}/{{ fontName }}.woff') format('woff'),
    url('{{ fontPath }}/{{ fontName }}/{{ fontName }}.ttf') format('truetype');

  font-weight: normal;
  font-style: normal;
}

@mixin icon-base {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: '{{ fontName }}';
  font-style: normal;
  font-variant: normal;
  font-weight: normal;
  line-height: 1;
  speak: none;
  text-transform: none;
}

$icon-codepoints: (
{% for icon in icons -%}
  '{{ icon.name }}': '\{{ icon.code }}',
{% endfor %}
);

@mixin icon($name) {
  &:before {
    @include icon-base;

    content: map-get($icon-codepoints, $name);

    @content;
  }
}

@mixin icon-after($name) {
  &:after {
    @include icon-base;

    content: map-get($icon-codepoints, $name);

    @content;
  }
}
