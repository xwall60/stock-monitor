
layui.use(['layer', 'form'], function () {
    const layer = layui.layer;
    const form = layui.form;

    const API_URL = "http://qt.gtimg.cn/q=";

    let stocks = JSON.parse(localStorage.getItem("stocks") || "[]");
    let listVisible = true;

    function fetchStockData(code, callback) {
        const script = document.createElement("script");
        script.src = API_URL + code;
        script.onload = () => {
            const raw = window["v_" + code];
            if (raw) {
                const parts = raw.split("~");
                const price = parseFloat(parts[3]);
                const name = parts[1];
                callback({ code, name, price });
            }
            document.body.removeChild(script);
        };
        document.body.appendChild(script);
    }

    function renderTable() {
        const tbody = document.getElementById("stockTableBody");
        tbody.innerHTML = "";
        stocks.forEach((stock, index) => {
            fetchStockData(stock.code, data => {
                const value = (data.price * stock.holding).toFixed(2);
                const change = (((data.price - stock.cost) / stock.cost) * 100).toFixed(2);
                const profit = ((data.price - stock.cost) * stock.holding).toFixed(2);
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${stock.code} / ${value}</td>
                    <td>${data.price} / ${stock.cost}</td>
                    <td>${change}%</td>
                    <td>${stock.holding} / ${profit}</td>
                    <td>
                        <button class="layui-btn layui-btn-xs edit-btn" data-index="${index}" data-lang="edit">Edit</button>
                        <button class="layui-btn layui-btn-danger layui-btn-xs delete-btn" data-index="${index}" data-lang="delete">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
                
            });
        });
        applyI18n();
    }

    document.getElementById("addStockBtn").onclick = () => {
        layer.open({
            type: 1,
            title: "Add Stock",
            area: ['300px', '300px'],
            content: `
                <div style="padding:20px;">
                    <input type="text" id="stockCode" placeholder="Code" class="layui-input" /><br/>
                    <input type="number" id="stockCost" placeholder="Cost" class="layui-input" /><br/>
                    <input type="number" id="stockHolding" placeholder="Holding" class="layui-input" /><br/>
                    <button class="layui-btn" id="saveStock">Save</button>
                </div>
            `,
            success: function () {
                document.getElementById("saveStock").onclick = () => {
                    const code = document.getElementById("stockCode").value.trim();
                    const cost = parseFloat(document.getElementById("stockCost").value);
                    const holding = parseInt(document.getElementById("stockHolding").value);
                    if (code && !isNaN(cost) && !isNaN(holding)) {
                        stocks.push({ code, cost, holding });
                        localStorage.setItem("stocks", JSON.stringify(stocks));
                        layer.closeAll();
                        renderTable();
                    }
                };
            }
        });
    };

    document.getElementById("stockTableBody").onclick = (e) => {
        if (e.target.classList.contains("edit-btn")) {
            const index = e.target.getAttribute("data-index");
            const stock = stocks[index];
            layer.open({
                type: 1,
                title: "Edit Stock",
                area: ['300px', '300px'],
                content: `
                    <div style="padding:20px;">
                        <input type="text" id="editCode" value="${stock.code}" class="layui-input" /><br/>
                        <input type="number" id="editCost" value="${stock.cost}" class="layui-input" /><br/>
                        <input type="number" id="editHolding" value="${stock.holding}" class="layui-input" /><br/>
                        <button class="layui-btn" id="updateStock">Update</button>
                    </div>
                `,
                success: function () {
                    document.getElementById("updateStock").onclick = () => {
                        const code = document.getElementById("editCode").value.trim();
                        const cost = parseFloat(document.getElementById("editCost").value);
                        const holding = parseInt(document.getElementById("editHolding").value);
                        if (code && !isNaN(cost) && !isNaN(holding)) {
                            stocks[index] = { code, cost, holding };
                            localStorage.setItem("stocks", JSON.stringify(stocks));
                            layer.closeAll();
                            renderTable();
                        }
                    };
                }
            });
        } else if (e.target.classList.contains("delete-btn")) {
            const index = e.target.getAttribute("data-index");
            stocks.splice(index, 1);
            localStorage.setItem("stocks", JSON.stringify(stocks));
            renderTable();
        }
    };

    document.getElementById("toggleListBtn").onclick = () => {
        listVisible = !listVisible;
        document.getElementById("stockListContainer").style.display = listVisible ? "block" : "none";
        document.getElementById("toggleIcon").className = listVisible ? "layui-icon layui-icon-eye" : "layui-icon layui-icon-eye-invisible";
    };

    document.getElementById("languageSelect").onchange = (e) => {
        // updateLanguage(e.target.value);
        console.log (e.target.value)
        const lang = e.target.value;
        localStorage.setItem('lang', lang);
        applyI18n();
    };

    renderTable();
});
