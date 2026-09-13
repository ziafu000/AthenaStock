"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
    Search,
    X,
    Calculator,
    Lightbulb,
    AlertCircle,
    ArrowUpRight,
    ArrowLeft,
    Layers,
    TrendingUp,
    Shield,
    Coins,
} from "lucide-react"

export interface GlossaryTerm {
    id: string
    symbol: string
    englishName: string
    vietnameseName: string
    category: "valuation" | "performance" | "cashflow" | "mindset"
    categoryLabel: string
    definition: string
    formula?: string
    interpretation: string
    caution?: string
    relatedLink?: {
        title: string
        href: string
    }
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
    {
        id: "pe",
        symbol: "P/E",
        englishName: "Price to Earnings Ratio",
        vietnameseName: "Hệ số Giá trên Lợi nhuận một cổ phiếu",
        category: "valuation",
        categoryLabel: "Định giá & Sinh lời",
        definition: "Thước đo định giá cơ bản nhất so sánh giữa giá thị trường hiện tại của một cổ phiếu và lợi nhuận ròng trên mỗi cổ phần (EPS) mà doanh nghiệp đó tạo ra trong 4 quý gần nhất.",
        formula: "P/E = Giá thị trường mỗi cổ phiếu (Price) / Lợi nhuận sau thuế mỗi cổ phiếu (EPS) = Vốn hóa / Lợi nhuận sau thuế",
        interpretation: "Cho biết nhà đầu tư đang sẵn sàng trả bao nhiêu đồng cho mỗi 1 đồng lợi nhuận của doanh nghiệp. P/E cao thường phản ánh kỳ vọng tăng trưởng mạnh trong tương lai; P/E thấp có thể là món hời nhưng cũng có thể là bẫy giá trị.",
        caution: "Lợi nhuận kế toán (E) dễ bị bóp méo bởi các khoản thu nhập bất thường một lần hoặc thủ thuật kế toán dồn tích. Luôn đối chiếu P/E với tốc độ tăng trưởng và chất lượng dòng tiền thực tế.",
        relatedLink: {
            title: "Checklist Phân tích Doanh nghiệp",
            href: "/frameworks/checklist-phan-tich",
        },
    },
    {
        id: "pb",
        symbol: "P/B",
        englishName: "Price to Book Ratio",
        vietnameseName: "Hệ số Giá trên Giá trị sổ sách",
        category: "valuation",
        categoryLabel: "Định giá & Sinh lời",
        definition: "Chỉ số so sánh giá trị vốn hóa thị trường của công ty với giá trị tài sản ròng kế toán (Vốn chủ sở hữu) được ghi nhận trên Bảng cân đối kế toán.",
        formula: "P/B = Giá cổ phiếu / Giá trị sổ sách mỗi cổ phần (BVPS) = Vốn hóa thị trường / Vốn chủ sở hữu",
        interpretation: "Cho biết thị trường đang định giá doanh nghiệp gấp bao nhiêu lần giá trị tài sản ròng kế toán. Thích hợp nhất khi định giá các định chế tài chính (ngân hàng, bảo hiểm) hoặc doanh nghiệp thâm dụng tài sản hữu hình.",
        caution: "P/B ít có ý nghĩa đối với các công ty công nghệ, dược phẩm hay dịch vụ nơi mà các tài sản vô hình giá trị nhất (thương hiệu, bằng sáng chế, con người) không được ghi nhận đầy đủ trên bảng cân đối kế toán.",
        relatedLink: {
            title: "FPT Corp: Mô hình kinh doanh nhẹ vốn",
            href: "/business/fpt-corporation",
        },
    },
    {
        id: "roe",
        symbol: "ROE",
        englishName: "Return on Equity",
        vietnameseName: "Tỷ suất sinh lời trên Vốn chủ sở hữu",
        category: "performance",
        categoryLabel: "Hiệu quả & Tài chính",
        definition: "Thước đo hiệu quả sử dụng vốn của cổ đông, cho biết mỗi 100 đồng vốn chủ sở hữu bỏ vào hoặc giữ lại trong doanh nghiệp sinh ra được bao nhiêu đồng lợi nhuận ròng hàng năm.",
        formula: "ROE = (Lợi nhuận sau thuế / Vốn chủ sở hữu bình quân) × 100%",
        interpretation: "Warren Buffett coi ROE duy trì bền vững trên 15%–20% mà không dùng nợ vay quá mức là một trong những chỉ dấu tin cậy nhất về sự hiện diện của một con hào kinh tế (Moat).",
        caution: "ROE có thể bị thổi phồng giả tạo nếu công ty sử dụng đòn bẩy tài chính (nợ vay) quá cao. Cần dùng mô hình DuPont (Biên ròng × Vòng quay tài sản × Đòn bẩy tài chính) để bóc tách nguồn gốc thực sự của ROE.",
        relatedLink: {
            title: "Checklist 4 lớp lọc Buffett",
            href: "/frameworks/checklist-phan-tich",
        },
    },
    {
        id: "roic",
        symbol: "ROIC",
        englishName: "Return on Invested Capital",
        vietnameseName: "Tỷ suất sinh lời trên Vốn đầu tư",
        category: "performance",
        categoryLabel: "Hiệu quả & Tài chính",
        definition: "Thước đo toàn diện về năng lực phân bổ vốn của ban lãnh đạo, đo lường tỷ suất sinh lời hoạt động cốt lõi trên toàn bộ nguồn vốn dài hạn (cả nợ vay có lãi và vốn cổ phần).",
        formula: "ROIC = NOPAT / Invested Capital = (EBIT × [1 - Thuế suất]) / (Vốn chủ sở hữu + Nợ vay chịu lãi - Tiền mặt dư thừa)",
        interpretation: "Nếu ROIC lớn hơn Chi phí vốn bình quân (WACC), mỗi đồng vốn công ty tái đầu tư mở rộng sẽ kiến tạo thêm giá trị thặng dư cho cổ đông. Nếu ROIC nhỏ hơn WACC, tăng trưởng càng nhanh công ty càng tiêu hủy giá trị.",
        caution: "Cần loại bỏ tiền mặt nhàn rỗi vượt quá nhu cầu hoạt động hàng ngày ra khỏi mẫu số để tránh làm giảm tỷ suất sinh lời thực tế của tài sản hoạt động cốt lõi.",
        relatedLink: {
            title: "Độ nhạy Mô hình DCF & WACC",
            href: "/frameworks/dcf-sensitivity",
        },
    },
    {
        id: "fcf",
        symbol: "FCF",
        englishName: "Free Cash Flow",
        vietnameseName: "Dòng tiền tự do",
        category: "cashflow",
        categoryLabel: "Dòng tiền & Chủ sở hữu",
        definition: "Lượng tiền mặt thực tế còn lại sau khi doanh nghiệp đã thanh toán toàn bộ chi phí vận hành thường xuyên và chi tiêu cho việc mua sắm, bảo trì tài sản cố định (Capex).",
        formula: "FCF = Dòng tiền từ hoạt động kinh doanh (CFO/OCF) - Chi tiêu vốn mua sắm TSCĐ (Capex)",
        interpretation: "Khác với lợi nhuận kế toán có thể bị tác động bởi nguyên tắc dồn tích, FCF là tiền mặt thật sự có thể dùng để trả cổ tức, mua lại cổ phiếu quỹ, trả nợ vay hoặc đầu tư chiến lược mà không cần pha loãng cổ phiếu.",
        caution: "FCF trong một năm đơn lẻ có thể biến động mạnh do chu kỳ vốn lưu động hoặc đợt mở rộng nhà máy lớn. Cần đánh giá FCF bình quân qua chu kỳ từ 3 đến 5 năm.",
        relatedLink: {
            title: "Lợi nhuận Chủ sở hữu vs. FCF",
            href: "/frameworks/owner-earnings",
        },
    },
    {
        id: "moat",
        symbol: "Moat",
        englishName: "Economic Moat",
        vietnameseName: "Lợi thế cạnh tranh kinh tế bền vững (Hào kinh tế)",
        category: "mindset",
        categoryLabel: "Tư duy & Lợi thế",
        definition: "Khái niệm do Warren Buffett phổ biến, ví doanh nghiệp như một tòa lâu đài kinh tế và con hào nước sâu bao quanh là rào cản ngăn các đối thủ cạnh tranh xâm lấn thị phần và bào mòn tỷ suất sinh lời siêu ngạch.",
        formula: "Định tính dựa trên 4 nguồn: Lợi thế chi phí, Chi phí chuyển đổi, Hiệu ứng mạng lưới, Tài sản vô hình (thương hiệu, bằng sáng chế)",
        interpretation: "Một doanh nghiệp có Moat rộng có thể duy trì ROIC và biên lợi nhuận cao liên tục trong hàng thập kỷ bất chấp sự tấn công của đối thủ cạnh tranh có nguồn vốn lớn.",
        caution: "Moat không phải là vĩnh cửu. Sự thay đổi về công nghệ đột phá, thói quen người tiêu dùng hoặc sự tự mãn của ban điều hành có thể làm xói mòn con hào theo thời gian.",
        relatedLink: {
            title: "Đánh giá Moat qua Checklist",
            href: "/frameworks/checklist-phan-tich",
        },
    },
    {
        id: "margin-of-safety",
        symbol: "Margin of Safety",
        englishName: "Margin of Safety",
        vietnameseName: "Biên an toàn",
        category: "mindset",
        categoryLabel: "Tư duy & Lợi thế",
        definition: "Khái niệm trung tâm của đầu tư giá trị do Benjamin Graham sáng lập. Đó là mức chênh lệch chiết khấu giữa giá thị trường phải trả và ước tính giá trị nội tại thận trọng của doanh nghiệp.",
        formula: "Biên an toàn (%) = [(Giá trị nội tại ước tính - Giá thị trường) / Giá trị nội tại ước tính] × 100%",
        interpretation: "Biên an toàn là tấm nệm hấp thụ chấn động bảo vệ nhà đầu tư trước những sai số dự báo tất yếu, biến động chu kỳ bất ngờ và các yếu tố bất khả kháng trong tương lai.",
        caution: "Biên an toàn dựa trên một ước tính giá trị nội tại sai lầm thì không còn là an toàn. Nếu giá trị doanh nghiệp tiếp tục suy thoái, biên an toàn sẽ nhanh chóng biến mất.",
        relatedLink: {
            title: "Triết lý Đầu tư Dài hạn & Biên an toàn",
            href: "/articles/triet-ly-dai-han",
        },
    },
    {
        id: "owner-earnings",
        symbol: "Owner Earnings",
        englishName: "Owner Earnings",
        vietnameseName: "Lợi nhuận của Chủ sở hữu",
        category: "cashflow",
        categoryLabel: "Dòng tiền & Chủ sở hữu",
        definition: "Thước đo dòng tiền thực tế được Warren Buffett công bố năm 1986, phản ánh lượng tiền mặt mà chủ doanh nghiệp có thể rút ra mà không làm suy giảm vị thế cạnh tranh hay năng lực sản xuất hiện hữu.",
        formula: "Owner Earnings = Lợi nhuận sau thuế + Khấu hao & Hao mòn ± Khoản mục phi tiền mặt - Chi phí vốn duy trì - Nhu cầu vốn lưu động tăng thêm",
        interpretation: "Giải quyết triệt để điểm mù của lợi nhuận kế toán Net Income (bỏ qua nhu cầu tái đầu tư tài sản) và EBITDA (bỏ qua hoàn toàn chi phí thay thế hao mòn máy móc).",
        caution: "Báo cáo tài chính theo chuẩn kế toán không tách riêng Maintenance Capex và Growth Capex; nhà đầu tư phải tự ước tính bằng phân tích chuyên sâu.",
        relatedLink: {
            title: "Khung phân tích Owner Earnings",
            href: "/frameworks/owner-earnings",
        },
    },
    {
        id: "wacc",
        symbol: "WACC",
        englishName: "Weighted Average Cost of Capital",
        vietnameseName: "Chi phí vốn bình quân gia quyền",
        category: "valuation",
        categoryLabel: "Định giá & Sinh lời",
        definition: "Tỷ suất sinh lời tối thiểu mà doanh nghiệp cần tạo ra trên các tài sản của mình để bù đắp chi phí đòi hỏi từ tất cả các nhà cung cấp vốn (chủ nợ và cổ đông).",
        formula: "WACC = (E/V × Ke) + (D/V × Kd × [1 - T])",
        interpretation: "Được dùng làm tỷ suất chiết khấu trong mô hình định giá dòng tiền DCF và mức rào cản tối thiểu (hurdle rate) cho các quyết định mở rộng đầu tư mới của doanh nghiệp.",
        caution: "Một biến động nhỏ của WACC (chỉ 1%) trong mô hình DCF có thể làm thay đổi từ 15% đến 25% giá trị ước tính của doanh nghiệp.",
        relatedLink: {
            title: "Độ nhạy Mô hình DCF & WACC",
            href: "/frameworks/dcf-sensitivity",
        },
    },
    {
        id: "terminal-value",
        symbol: "Terminal Value",
        englishName: "Terminal Value (TV)",
        vietnameseName: "Giá trị cuối kỳ",
        category: "valuation",
        categoryLabel: "Định giá & Sinh lời",
        definition: "Giá trị tại cuối giai đoạn dự báo chi tiết của toàn bộ dòng tiền mà doanh nghiệp được kỳ vọng sẽ tiếp tục tạo ra sau thời điểm đó.",
        formula: "TV tại năm n = [FCF năm n × (1 + g)] / (WACC - g); Giá trị hiện tại của TV = TV tại năm n / (1 + WACC)^n",
        interpretation: "Trong các doanh nghiệp chất lượng cao, Terminal Value thường chiếm tới 65% đến 85% tổng giá trị nội tại được mô hình hóa theo phương pháp DCF.",
        caution: "Terminal Value cực kỳ nhạy cảm với giả định tốc độ tăng trưởng dài hạn (g) và tỷ suất chiết khấu (WACC). Dễ bị các nhà phân tích lạm dụng để hợp lý hóa mức giá cao.",
        relatedLink: {
            title: "Nghịch lý Terminal Value trong DCF",
            href: "/frameworks/dcf-sensitivity",
        },
    },
    {
        id: "earnings-yield",
        symbol: "Earnings Yield",
        englishName: "Earnings Yield",
        vietnameseName: "Tỷ suất Lợi tức trên Giá cổ phiếu",
        category: "valuation",
        categoryLabel: "Định giá & Sinh lời",
        definition: "Tỷ lệ nghịch đảo của hệ số P/E, thể hiện tỷ lệ phần trăm lợi nhuận sau thuế trên mỗi cổ phiếu so với mức giá bạn phải trả để mua cổ phiếu đó.",
        formula: "Earnings Yield = (EPS / Giá thị trường) × 100% = (1 / P/E) × 100%",
        interpretation: "Cho phép so sánh trực tiếp sức hấp dẫn của một cổ phiếu với các kênh đầu tư thay thế như lợi suất trái phiếu chính phủ hay lãi suất tiền gửi ngân hàng. Cổ phiếu có P/E = 12.5x tương ứng Earnings Yield = 8%.",
        caution: "Earnings Yield không phải là cổ tức tiền mặt cầm tay; nó bao gồm cả phần lợi nhuận được ban lãnh đạo giữ lại tái đầu tư.",
        relatedLink: {
            title: "Triết lý Đầu tư Dài hạn",
            href: "/articles/triet-ly-dai-han",
        },
    },
    {
        id: "net-margin",
        symbol: "Net Margin",
        englishName: "Net Profit Margin",
        vietnameseName: "Biên lợi nhuận ròng",
        category: "performance",
        categoryLabel: "Hiệu quả & Tài chính",
        definition: "Tỷ lệ phần trăm của doanh thu thuần còn giữ lại được dưới dạng lợi nhuận sau thuế sau khi đã thanh toán toàn bộ chi phí giá vốn, bán hàng, quản lý, lãi vay và thuế TNDN.",
        formula: "Biên lợi nhuận ròng = (Lợi nhuận sau thuế / Doanh thu thuần) × 100%",
        interpretation: "Thể hiện quyền định giá (Pricing Power) và kỷ luật kiểm soát chi phí. Doanh nghiệp có biên ròng cao và giữ vững qua các thời kỳ lạm phát thường có hào kinh tế vượt trội.",
        caution: "Biên ròng có thể bị biến dạng tạm thời bởi các khoản thu nhập tài chính đột biến (như thoái vốn công ty con) hoặc hoàn nhập dự phòng.",
        relatedLink: {
            title: "FPT Corp: Cơ cấu biên lợi nhuận",
            href: "/business/fpt-corporation",
        },
    },
    {
        id: "operating-leverage",
        symbol: "Operating Leverage",
        englishName: "Operating Leverage",
        vietnameseName: "Đòn bẩy hoạt động",
        category: "performance",
        categoryLabel: "Hiệu quả & Tài chính",
        definition: "Mức độ nhạy cảm của lợi nhuận hoạt động (EBIT) trước thay đổi của doanh thu; cấu trúc có chi phí cố định cao thường tạo ra đòn bẩy hoạt động lớn khi doanh nghiệp ở trên điểm hòa vốn.",
        formula: "Độ lớn đòn bẩy hoạt động (DOL) = % Biến thiên Lợi nhuận hoạt động (EBIT) / % Biến thiên Doanh thu",
        interpretation: "Khi một doanh nghiệp có chi phí cố định cao vượt qua điểm hòa vốn, mỗi đồng doanh thu tăng thêm sẽ chuyển hóa thành tỷ lệ phần trăm tăng trưởng lợi nhuận hoạt động lớn hơn nhiều.",
        caution: "Đòn bẩy hoạt động là con dao hai lưỡi: Khi doanh thu sụt giảm nhẹ trong thời kỳ suy thoái, lợi nhuận hoạt động có thể rơi tự do và biến thành những khoản lỗ khổng lồ.",
        relatedLink: {
            title: "Checklist Phân tích Doanh nghiệp",
            href: "/frameworks/checklist-phan-tich",
        },
    },
    {
        id: "capex",
        symbol: "Capex",
        englishName: "Capital Expenditures",
        vietnameseName: "Chi phí vốn đầu tư tài sản",
        category: "performance",
        categoryLabel: "Hiệu quả & Tài chính",
        definition: "Các khoản ngân quỹ mà doanh nghiệp sử dụng để mua sắm, nâng cấp và mở rộng tài sản cố định thể chất như nhà máy, máy móc, hệ thống thiết bị công nghệ hoặc tài sản dài hạn.",
        formula: "Capex = Dòng tiền chi để mua sắm TSCĐ trên Báo cáo lưu chuyển tiền tệ (Cash Flow Statement)",
        interpretation: "Capex cho thấy doanh nghiệp đang ở giai đoạn mở rộng công suất hay thu hoạch. Cần bóc tách thành Maintenance Capex (chi phí bắt buộc để tồn tại) và Growth Capex (chi phí mở rộng để tăng trưởng).",
        caution: "Nhiều ban quản trị phân loại sai chi phí vận hành định kỳ thành Capex để làm đẹp báo cáo kết quả kinh doanh ngắn hạn và trì hoãn ghi nhận chi phí vào lợi nhuận.",
        relatedLink: {
            title: "Bóc tách Capex trong Owner Earnings",
            href: "/frameworks/owner-earnings",
        },
    },
    {
        id: "working-capital",
        symbol: "Working Capital",
        englishName: "Net Working Capital (NWC)",
        vietnameseName: "Vốn lưu động ròng",
        category: "performance",
        categoryLabel: "Hiệu quả & Tài chính",
        definition: "Thước đo lượng vốn khả dụng ngắn hạn cần thiết để tài trợ cho hoạt động vận hành thường nhật của doanh nghiệp, bằng tài sản ngắn hạn hoạt động trừ nợ ngắn hạn hoạt động.",
        formula: "NWC hoạt động = (Các khoản phải thu + Hàng tồn kho + Tài sản ngắn hạn hoạt động khác) - (Các khoản phải trả nhà cung cấp + Nợ ngắn hạn hoạt động khác)",
        interpretation: "Đo lường lượng vốn bị ràng buộc trong hoạt động thường nhật, không bao gồm tiền mặt dư thừa và nợ vay chịu lãi. Doanh nghiệp có vị thế độc quyền có thể vận hành với Vốn lưu động hoạt động âm nhờ chiếm dụng vốn lành mạnh từ nhà cung cấp và nhận tiền trước từ khách hàng.",
        caution: "Sự tăng vọt bất thường của vốn lưu động do phải thu hoặc tồn kho ứ đọng là tín hiệu cảnh báo nghiêm trọng về chất lượng doanh thu và nguy cơ nợ khó đòi.",
        relatedLink: {
            title: "Dấu hiệu cảnh báo trong Báo cáo tài chính",
            href: "/psychology/confirmation-bias",
        },
    },
    {
        id: "goodwill",
        symbol: "Goodwill",
        englishName: "Goodwill",
        vietnameseName: "Lợi thế thương mại",
        category: "performance",
        categoryLabel: "Hiệu quả & Tài chính",
        definition: "Một khoản mục tài sản vô hình trên Bảng cân đối kế toán phát sinh khi một doanh nghiệp mua lại công ty khác với giá cao hơn giá trị thị trường hợp lý của toàn bộ tài sản thuần xác định được.",
        formula: "Goodwill = Giá mua thâu tóm bên ngoài - Giá trị thị trường hợp lý của tài sản thuần doanh nghiệp mục tiêu",
        interpretation: "Đại diện cho các yếu tố vô hình không thể tách rời như danh tiếng thương hiệu, tệp khách hàng trung thành, bằng sáng chế hoặc đội ngũ nhân sự xuất sắc của công ty được mua lại.",
        caution: "Nếu thương vụ M&A thất bại hoặc không mang lại tăng trưởng như kỳ vọng, doanh nghiệp sẽ phải ghi nhận giảm giá trị lợi thế thương mại (Goodwill Impairment), gây tổn thất nặng nề đến lợi nhuận ròng kế toán.",
        relatedLink: {
            title: "Checklist đánh giá Ban lãnh đạo & M&A",
            href: "/frameworks/checklist-phan-tich",
        },
    },
    {
        id: "float",
        symbol: "Float",
        englishName: "Underwriting Float",
        vietnameseName: "Dòng tiền nhàn rỗi trong bảo hiểm & tài chính",
        category: "cashflow",
        categoryLabel: "Dòng tiền & Chủ sở hữu",
        definition: "Số tiền mà công ty bảo hiểm thu trước từ phí bảo hiểm của khách hàng và được phép giữ lại để đầu tư sinh lời trong nhiều năm trước khi phải chi trả bồi thường cho các tổn thất phát sinh.",
        formula: "Float = Dự phòng phí bảo hiểm chưa được hưởng + Dự phòng bồi thường tổn thất đã phát sinh",
        interpretation: "Vũ khí tài chính tối thượng của Warren Buffett tại Berkshire Hathaway. Float hoạt động như một khoản vay không chịu lãi suất (thậm chí có lãi nếu phí bảo hiểm lớn hơn chi phí bồi thường) giúp gia tăng quy mô đầu tư khổng lồ.",
        caution: "Nếu một công ty bảo hiểm định giá phí bảo hiểm quá thấp để cạnh tranh giành khách hàng, chi phí bồi thường sẽ vượt xa phí thu được, biến Float thành một gánh nặng tài chính độc hại.",
        relatedLink: {
            title: "Triết lý Đầu tư Dài hạn của Buffett",
            href: "/articles/triet-ly-dai-han",
        },
    },
    {
        id: "book-value",
        symbol: "Book Value",
        englishName: "Book Value of Equity",
        vietnameseName: "Giá trị sổ sách của Vốn chủ sở hữu",
        category: "performance",
        categoryLabel: "Hiệu quả & Tài chính",
        definition: "Giá trị tài sản ròng theo nguyên tắc kế toán của doanh nghiệp, tương đương với số tiền còn lại về mặt lý thuyết thuộc về các cổ đông nếu công ty thanh lý toàn bộ tài sản và thanh toán hết tất cả nợ phải trả.",
        formula: "Book Value = Tổng tài sản - Tổng nợ phải trả = Vốn chủ sở hữu (Shareholders' Equity)",
        interpretation: "Cung cấp một điểm tựa định lượng về giá trị tài sản ròng của công ty. Thường được sử dụng để tính BVPS và hệ số P/B trong phân tích định giá.",
        caution: "Giá trị sổ sách không phản ánh giá trị thị trường thực tế của tài sản cố định (ví dụ đất đai ghi theo giá gốc lịch sử nhiều năm trước) và bỏ qua tài sản vô hình do chính công ty xây dựng.",
        relatedLink: {
            title: "Checklist Phân tích Doanh nghiệp",
            href: "/frameworks/checklist-phan-tich",
        },
    },
    {
        id: "intrinsic-value",
        symbol: "Intrinsic Value",
        englishName: "Intrinsic Value",
        vietnameseName: "Giá trị nội tại",
        category: "valuation",
        categoryLabel: "Định giá & Sinh lời",
        definition: "Giá trị kinh tế thực chất và toàn diện của một doanh nghiệp, được xác định bằng tổng lượng tiền mặt chiết khấu mà công ty có thể tạo ra cho cổ đông trong suốt quãng đời hoạt động còn lại.",
        formula: "Intrinsic Value = Tổng dòng tiền tự do trong tương lai được chiết khấu về hiện tại theo tỷ suất rủi ro phù hợp",
        interpretation: "Giá trị nội tại là một con số ước tính có xác suất, không phải con số cố định tuyệt đối. Mục tiêu của nhà đầu tư thông minh là mua cổ phiếu khi Giá thị trường (Price) thấp hơn đáng kể so với Giá trị nội tại (Value).",
        caution: "Không có bảng tính hay công thức nào cho ra giá trị nội tại chính xác tuyệt đối. Do đó, Biên an toàn (Margin of Safety) là yêu cầu tiên quyết trước khi giải ngân.",
        relatedLink: {
            title: "Triết lý Đầu tư Dài hạn & Giá trị Nội tại",
            href: "/articles/triet-ly-dai-han",
        },
    },
    {
        id: "circle-of-competence",
        symbol: "Circle of Competence",
        englishName: "Circle of Competence",
        vietnameseName: "Vòng tròn năng lực",
        category: "mindset",
        categoryLabel: "Tư duy & Lợi thế",
        definition: "Mô hình tư duy nền tảng do Warren Buffett và Charlie Munger xây dựng, xác định ranh giới những ngành nghề và mô hình kinh doanh mà một cá nhân thực sự am hiểu tường tận.",
        formula: "Định tính: Hiểu rõ động lực doanh thu, cấu trúc chi phí, rủi ro công nghệ và lợi thế cạnh tranh của ngành",
        interpretation: "Kích thước của vòng tròn năng lực không quan trọng bằng việc biết chính xác đâu là đường ranh giới của nó. Việc ở yên bên trong vòng tròn giúp bạn tránh được những sai lầm thảm khốc.",
        caution: "Nhà đầu tư thường nhầm lẫn giữa 'sự quen thuộc thông thường' (ví dụ hay uống cà phê, hay lướt mạng xã hội) với 'sự hiểu biết sâu sắc về cấu trúc kinh tế của ngành'.",
        relatedLink: {
            title: "Checklist 4 Bộ lọc Doanh nghiệp",
            href: "/frameworks/checklist-phan-tich",
        },
    },
]

const CATEGORIES = [
    { id: "all", label: "Tất cả thuật ngữ", icon: Layers },
    { id: "valuation", label: "Định giá & Sinh lời", icon: TrendingUp },
    { id: "performance", label: "Hiệu quả & Tài chính", icon: Calculator },
    { id: "cashflow", label: "Dòng tiền & Chủ sở hữu", icon: Coins },
    { id: "mindset", label: "Tư duy & Lợi thế", icon: Shield },
] as const

export function GlossaryClient() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    const filteredTerms = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()

        return GLOSSARY_TERMS.filter((term) => {
            const matchesCategory =
                selectedCategory === "all" || term.category === selectedCategory

            if (!matchesCategory) return false

            if (!query) return true

            return (
                term.symbol.toLowerCase().includes(query) ||
                term.englishName.toLowerCase().includes(query) ||
                term.vietnameseName.toLowerCase().includes(query) ||
                term.definition.toLowerCase().includes(query) ||
                (term.formula && term.formula.toLowerCase().includes(query)) ||
                term.interpretation.toLowerCase().includes(query)
            )
        })
    }, [searchQuery, selectedCategory])

    return (
        <div className="space-y-12">
            {/* Navigation back to Library */}
            <div className="flex items-center justify-between">
                <Link
                    href="/library"
                    className="inline-flex items-center gap-2 text-sm text-[#a0a5b5] hover:text-[#e61c5c] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại Thư viện</span>
                </Link>

                <div className="text-xs font-sans text-[#a0a5b5] bg-white/[0.03] border border-white/[0.08] px-3 py-1 rounded-full">
                    Hiển thị <span className="text-[#e61c5c] font-semibold">{filteredTerms.length}</span> / {GLOSSARY_TERMS.length} thuật ngữ
                </div>
            </div>

            {/* Controls: Search & Category Filters */}
            <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                        <Search className="h-5 w-5 text-[#a0a5b5]" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm theo mã viết tắt (P/E, ROE, WACC...), tên tiếng Việt hoặc từ khóa..."
                        className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.1] text-white placeholder-[#a0a5b5]/60 focus:outline-none focus:border-[#e61c5c]/60 focus:ring-2 focus:ring-[#e61c5c]/20 transition-all font-sans text-sm backdrop-blur-md"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#a0a5b5] hover:text-white transition-colors"
                            aria-label="Xóa tìm kiếm"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {CATEGORIES.map((category) => {
                        const Icon = category.icon
                        const isActive = selectedCategory === category.id
                        const count =
                            category.id === "all"
                                ? GLOSSARY_TERMS.length
                                : GLOSSARY_TERMS.filter((t) => t.category === category.id).length

                        return (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setSelectedCategory(category.id)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans font-medium transition-all duration-200 border ${
                                    isActive
                                        ? "bg-[#e61c5c] text-white border-[#e61c5c] shadow-lg shadow-[#e61c5c]/20"
                                        : "bg-white/[0.02] text-[#a0a5b5] border-white/[0.08] hover:border-white/20 hover:text-white"
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{category.label}</span>
                                <span
                                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                        isActive ? "bg-white/20 text-white" : "bg-white/5 text-[#a0a5b5]"
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Terms List / Cards */}
            {filteredTerms.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {filteredTerms.map((term) => (
                        <article
                            key={term.id}
                            id={term.id}
                            className="group relative rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 backdrop-blur-md hover:border-[#e61c5c]/40 hover:bg-[#e61c5c]/[0.015] transition-all duration-300 shadow-xl flex flex-col justify-between"
                        >
                            <div className="absolute -inset-px bg-gradient-to-br from-[#e61c5c]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />

                            <div className="space-y-4 relative z-10">
                                {/* Header: Symbol, Category badge, Names */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="text-2xl font-serif font-bold text-white group-hover:text-[#e61c5c] transition-colors tracking-tight">
                                            {term.symbol}
                                        </h2>
                                        <span className="text-[10px] font-sans uppercase tracking-wider text-[#a0a5b5] border border-white/10 px-2.5 py-0.5 rounded-full bg-white/[0.04]">
                                            {term.categoryLabel}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-[#faf8f6]">
                                        {term.vietnameseName}
                                    </p>
                                    <p className="text-xs text-[#a0a5b5] font-mono">
                                        {term.englishName}
                                    </p>
                                </div>

                                {/* Definition */}
                                <div className="pt-2 border-t border-white/[0.06]">
                                    <p className="text-sm text-[#c0c5d5] leading-relaxed font-sans">
                                        {term.definition}
                                    </p>
                                </div>

                                {/* Formula (if available) */}
                                {term.formula && (
                                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] text-xs font-mono text-emerald-400/90 leading-relaxed overflow-x-auto">
                                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#a0a5b5] font-sans mb-1.5 font-semibold">
                                            <Calculator className="w-3 h-3 text-[#e61c5c]" />
                                            <span>Công thức tính:</span>
                                        </div>
                                        <div>{term.formula}</div>
                                    </div>
                                )}

                                {/* Interpretation / Context */}
                                <div className="space-y-1.5 pt-1">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#faf8f6] font-sans">
                                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Góc nhìn đầu tư:</span>
                                    </div>
                                    <p className="text-xs text-[#a0a5b5] leading-relaxed font-sans pl-5">
                                        {term.interpretation}
                                    </p>
                                </div>

                                {/* Caution / Caveat (if available) */}
                                {term.caution && (
                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 font-sans">
                                            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                                            <span>Điểm mù & Lưu ý:</span>
                                        </div>
                                        <p className="text-xs text-amber-100/70 leading-relaxed font-sans pl-5">
                                            {term.caution}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer: Related deep-dive article link */}
                            {term.relatedLink && (
                                <div className="pt-5 mt-4 border-t border-white/[0.06] relative z-10">
                                    <Link
                                        href={term.relatedLink.href}
                                        className="inline-flex items-center gap-1.5 text-xs text-[#e61c5c] hover:text-white transition-colors font-medium group/link"
                                    >
                                        <span>Xem bài phân tích liên quan: {term.relatedLink.title}</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                    </Link>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.01] max-w-xl mx-auto space-y-3">
                    <Search className="w-10 h-10 text-[#a0a5b5]/40 mx-auto" />
                    <h3 className="text-lg font-serif font-bold text-white">Không tìm thấy thuật ngữ phù hợp</h3>
                    <p className="text-sm text-[#a0a5b5] font-sans">
                        Không có thuật ngữ nào khớp với từ khóa &ldquo;{searchQuery}&rdquo;.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setSearchQuery("")
                            setSelectedCategory("all")
                        }}
                        className="mt-2 text-xs text-[#e61c5c] hover:underline font-medium"
                    >
                        Xóa bộ lọc và xem tất cả
                    </button>
                </div>
            )}
        </div>
    )
}
