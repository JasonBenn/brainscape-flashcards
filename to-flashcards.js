function getStyles(el) {
  var selector, rule;
  var result = [];
  var sheets = document.styleSheets;
  for (var i in sheets) {
    var rules = sheets[i].rules || sheets[i].cssRules;
    for (var r in rules) {
      selector = rules[r].selectorText;
      rule = rules[r].cssText;
      var $selection = $(el).add($(el).find('*'));
      $selection.each(function () {
        if (selector && selector.indexOf(":")===-1 && $(this).is(selector)) {
          if (result.indexOf(rule) === -1) {
            result.push(rule);
          }
          $(this).attr('style',rule.match(/\{(.*?)\}/)[1]);
        }
      });
    }
  }
  return result;
}

let getMethodName = ($el) => {
  let title = $el.find('.memberLabel').text()
  return title.substring(0, title.length-2)
}

let obscure = (html, toObscure) => {
  return html.replace(new RegExp(toObscure, 'g'), '___')
}

let toHTML = ($el) => {
  getStyles($el)
  if ($el[0] === undefined) debugger;
  return $el[0].outerHTML
}

let formatCode = ($el) => {
  return $el.css({fontSize: '0.5em'})
}

let perserveHTMLLineBreaks = (html) => {
  return html.replace(/\n/g, '<br/>')
}

let toFlashCards = () => {
  let dataStructure = $('.typeHeader').text();

  return $('.interfaceMember:not(:contains("Inherited from"))').map(function() {
    let $el = $(this);
    let methodName = getMethodName($el)
    let methodCategory = $el.prevAll('.groupTitle:first').text()
    let methodCategoryPeers = $el.prevAll('.groupTitle:first').nextUntil('.groupTitle')

    let description = $el.find('.synopsis');
    if (description.length) {
      var descriptionHTML = toHTML(description);
      var obscuredDescriptionHTML = obscure(descriptionHTML, methodName)
    } else {
      var descriptionHTML = ''
      var obscuredDescriptionHTML = ''
    }

    let code = formatCode($el.find('.codeBlock'));
    if (code.length) {
      var codeHTML = perserveHTMLLineBreaks(toHTML(code));
      var obscuredCodeHTML = obscure(codeHTML, methodName)
    } else {
      var codeHTML = ''
      var obscuredCodeHTML = ''
    }

    let footer = `<br/><br/><i>One of ${methodCategoryPeers.length} "${methodCategory.toLowerCase()}" methods for ${dataStructure}.</i>`

    let front = `<h3>${dataStructure}</h3>${obscuredDescriptionHTML}${obscuredCodeHTML}${footer}`.replace(/\n/g, ' ')
    let back = `<h2>${methodName}</h2>${descriptionHTML}${codeHTML}`.replace(/\n/g, ' ')

    return `${front}\t${back}`

  }).toArray().join("\n")
}

let links = $('.scrollContent h2 a')

copy(toFlashCards())
