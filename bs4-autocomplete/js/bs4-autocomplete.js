$.fn.extend({
    autocomplete(_setting) {
        this.setting = {
            zIndex: 1000,
            minLength: 3,
            maxHeight: 300,
            placeholder: ["Chọn 1 giá trị", "Nhập gì đó để tìm kiếm..."],
            notFound: "Không có dữ liệu",
            getDropdownContainer() {
                return `<div class="dropdown-content" style="max-height: ${this.maxHeight}px"></div>`;
            },
        };
        // Setting
        for (const key in _setting) {
            if (Object.hasOwnProperty.call(this.setting, key)) {
                this.setting[key] = _setting[key];
            }
        }
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
                var ele = $("<a href='#'>")
                        .attr({
                            "data-value":option.attr("value"),
                            "data-none-accent":noneAccent,
                            "title": text,
                            "class": "dropdown-item"
                        })
                        .append($("<span>").text(text), $('<button type="button">&times;</button>'));
                dropdownContent.append(ele);
            });
            if (optionEles.length == 0) {
                dropdownContent.append(`<a href="#" class="dropdown-item disabled">${setting.notFound}</a>`);
            }
            var selectedOption = select.find("option[selected]");
            if (selectedOption.length > 0) {
                var dropdownContainer = select.prev();
                var btnDropdown = dropdownContainer.find("button.bs4-dropdown");
                btnDropdown.text(selectedOption.text());
                select.val(selectedOption.val()).change();
                dropdownContent.find(`a[data-value=${selectedOption.val()}]`).addClass("active");
            }
        }

        var selectEles = this;
        var htmlInput = `<div class="bs4-dropdown-container position-relative">
                            <button type="button" class="form-control text-left bs4-dropdown" data-toggle="dropdown">${this.setting.placeholder[0]}</button>
                            <div class="dropdown-menu w-100" style="z-index:${this.setting.zIndex}">
                                <div class="px-3 mb-2">
                                    <input type="search" class="form-control" placeholder="${this.setting.placeholder[1]}" />
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

            var dropdownContainer = $(this.setting.getDropdownContainer());
            dropdownlist.append(dropdownContainer);
            mapValue(selectEle, dropdownContainer, selectEles.setting);

            // Sự kiện khi click vào item của dropdown
            dropdownlist.on("click", "a:not(.disabled)", function (ev) {
                var aEle = $(this);
                var value = aEle.attr("data-value");
                if (value) {
                    aEle.closest(".dropdown-menu").find("a.active").removeClass("active");
                    aEle.addClass("active");
                    btnDropdown.text(aEle.find('span').text());
                    selectEle.val(value).change();
                }
            });
            // Sự kiện khi click vào nút xóa chọn của một phần tử
            dropdownlist.on("click", "a:not(.disabled)>button", function (ev) {
                ev.stopPropagation();
                var aEle = $(this);
                btnDropdown.text(selectEles.setting.placeholder[0]);
                aEle.closest(".dropdown-menu").find("a.active").removeClass("active");
                selectEle[0].selectedIndex = -1;
                dropdownlist.dropdown('toggle');
            });

            inputTextEle.on("input", function (ev) {
                var inputVal = $(this).val().toLowerCase();
                var drnItems = dropdownlist.find("a:not(.disabled)");
                if (inputVal.length >= selectEles.setting.minLength) {
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
