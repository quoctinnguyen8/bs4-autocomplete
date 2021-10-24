$.fn.extend({
    autoCompleteSetting: {
        dropdownColor: "secondary",
        dropdownOutline: false,
        minLength: 3,
        maxHeight: 300,
        placeholder: "Nhập gì đó để tìm kiếm...",
        notFound: "Không có dữ liệu",
        getDropdownContainer() {
            return `<div class="dropdown-content" style="max-height: ${this.maxHeight}px"></div>`;
        },
    },
    autocomplete(_setting) {
        // Chuyển nội dung từ thẻ select sang dropdown
        function mapValue(select, dropdownContent, setting) {
            var optionEles = select.find("option");
            $.each(optionEles, function (i, option) {
                option = $(option);
                var text = option.text();
                var noneAccent = text
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .toLowerCase();
                dropdownContent.append(`<a href="#" data-value="${option.attr("value")}" data-none-accent="${noneAccent}" title="${text}" class="dropdown-item">${text}</a>`);
            });
            console.log(optionEles);
            if (optionEles.length == 0) {
                dropdownContent.append(`<a href="#" class="dropdown-item disabled">${setting.notFound}</a>`);
            }
        }

        var selectEles = this;
        var htmlInput = `<div class="bs4-dropdown-container position-relative">
                            <button class="form-control text-left bs4-dropdown" data-toggle="dropdown">${this.autoCompleteSetting.placeholder}</button>
                            <div class="dropdown-menu w-100">
                                <div class="px-3 mb-2">
                                    <input type="search" class="form-control" placeholder="${this.autoCompleteSetting.placeholder}" />
                                </div>
                            </div>
                        </div>`;

        selectEles.each((i, selectEle) => {
            selectEle.selectedIndex = -1;   // Xóa giá trị ban đầu của thẻ select
            selectEle = $(selectEle);
            selectEle.before(htmlInput);
            selectEle.hide();   //  Ẩn thẻ select ban đầu

            var container = selectEle.prev();
            var inputTextEle = container.find(".dropdown-menu input[type=search]");
            var dropdownlist = container.find(".dropdown-menu");
            var btnDropdown = container.find("button.bs4-dropdown");

            var dropdownContainer = $(this.autoCompleteSetting.getDropdownContainer());
            dropdownlist.append(dropdownContainer);
            mapValue(selectEle, dropdownContainer, selectEles.autoCompleteSetting);

            // Sự kiện khi click vào item của dropdown
            dropdownlist.on("click", "a:not(.disabled)", function (ev) {
                var aEle = $(this);
                var value = aEle.attr("data-value");
                if (value) {
                    aEle.closest(".dropdown-menu").find("a.active").removeClass("active");
                    aEle.addClass("active");
                    btnDropdown.text(aEle.text());
                    selectEle.val(value).change();
                }
            });

            inputTextEle.on("input", function (ev) {
                var inputVal = $(this).val().toLowerCase();
                var drnItems = dropdownlist.find("a:not(.disabled)");
                if (inputVal.length >= selectEles.autoCompleteSetting.minLength) {
                    drnItems.each(function (i, item) {
                        item = $(item);
                        var text = item.text().toLowerCase();
                        var noneAccentText = item.attr("data-none-accent");
                        if (text.indexOf(inputVal) >= 0 || noneAccentText.indexOf(inputVal) >= 0) {
                            item.show();
                        } else {
                            item.hide();
                        }
                    });
                }
                else{
                    drnItems.each(function (i, item) {
                        $(item).show();
                    });
                }
            });
        });
    }
});
// Sử dụng
$("select").autocomplete({
    url: '',

});