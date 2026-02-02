import Link from "next/link"
import Image from "next/image"

export const metadata = {
    title: "Về chúng tôi & Triết lý – Athena Stock",
    description: "Người dẫn đường đầu tư tỉnh thức. Không hứa lợi nhuận, không bán kèo, không cổ vũ giao dịch.",
}

export default function AboutPage() {
    return (
        <div className="container max-w-3xl py-10 md:py-16">
            <article className="prose prose-neutral dark:prose-invert mx-auto">
                {/* Header with Logo */}
                <div className="text-center mb-12 not-prose">
                    <Image
                        src="/logo.png"
                        alt="Athena Stock"
                        width={100}
                        height={100}
                        className="mx-auto mb-6"
                    />
                    <h1 className="text-4xl font-serif font-bold text-primary mb-4">
                        Về chúng tôi & Triết lý
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Những nhà đầu tư cá nhân, không phải guru. <br />
                        Chia sẻ kinh nghiệm, không bán hy vọng.
                    </p>
                </div>

                <h2>Tại sao chúng tôi làm website này</h2>
                <p>
                    Chúng tôi từng là những người giao dịch nhiều. Mỗi ngày mở app chứng khoán hàng chục lần.
                    Theo dõi từng biến động giá. Lo lắng khi thị trường đỏ. Hưng phấn khi xanh.
                    Và cuối cùng, chúng tôi nhận ra: <strong>kẻ thù lớn nhất của nhà đầu tư là chính mình</strong>.
                </p>
                <p>
                    Website này là nơi chúng tôi chia sẻ hành trình chuyển hóa — từ những người "lướt sóng"
                    sang tư duy của một nhà sở hữu doanh nghiệp dài hạn.
                </p>

                <h2>Triết lý đầu tư</h2>
                <p>
                    Chúng tôi tin vào đầu tư giá trị theo phong cách Warren Buffett và Charlie Munger:
                </p>
                <ul>
                    <li>Mua cổ phiếu là mua <strong>một phần sở hữu doanh nghiệp</strong></li>
                    <li>Giá cả là thứ bạn trả, <strong>giá trị</strong> là thứ bạn nhận</li>
                    <li><strong>Biên an toàn</strong> (Margin of Safety) là nguyên tắc sống còn</li>
                    <li>Hiểu rõ <strong>mô hình kinh doanh</strong> quan trọng hơn dự đoán giá ngày mai</li>
                    <li>Kiểm soát <strong>tâm lý hành vi</strong> quan trọng hơn kiếm "alpha"</li>
                </ul>

                <h2>Điều chúng tôi KHÔNG làm</h2>
                <div className="bg-secondary/30 rounded-lg p-6 not-prose mb-8">
                    <ul className="space-y-3 text-foreground">
                        <li className="flex items-start gap-3">
                            <span className="text-red-500 font-bold">✕</span>
                            <span>Không khuyến nghị mua/bán cổ phiếu cụ thể</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-500 font-bold">✕</span>
                            <span>Không hứa hẹn lợi nhuận hay target giá</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-500 font-bold">✕</span>
                            <span>Không bán "kèo", "signal", hay khóa học làm giàu nhanh</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-500 font-bold">✕</span>
                            <span>Không cổ vũ giao dịch thường xuyên</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-500 font-bold">✕</span>
                            <span>Không khoe thành tích hay lợi nhuận trong quá khứ</span>
                        </li>
                    </ul>
                </div>

                <h2>Điều chúng tôi có thể giúp</h2>
                <div className="bg-accent/5 rounded-lg p-6 not-prose mb-8">
                    <ul className="space-y-3 text-foreground">
                        <li className="flex items-start gap-3">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>Chia sẻ góc nhìn phân tích doanh nghiệp</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>Giúp nhận diện các thiên kiến tâm lý trong đầu tư</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>Xây dựng framework tư duy dài hạn</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>Đồng hành trong hành trình đầu tư (nếu bạn muốn)</span>
                        </li>
                    </ul>
                </div>

                <h2>Nếu bạn muốn trao đổi</h2>
                <p>
                    Chúng tôi không bán dịch vụ theo kiểu "đăng ký ngay để nhận ưu đãi".
                    Nhưng nếu bạn cần người đồng hành để trao đổi nghiêm túc về đầu tư dài hạn —
                    không phải để xin mã, mà để hiểu cách tư duy — chúng ta có thể nói chuyện.
                </p>

                <div className="not-prose mt-8">
                    <Link
                        href="/advisory"
                        className="inline-flex items-center px-6 py-3 rounded-md border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                        Tìm hiểu về Tư vấn & Đồng hành
                    </Link>
                </div>

                <hr />

                <p className="text-sm text-muted-foreground">
                    Vui lòng đọc kỹ <Link href="/disclaimer">Miễn trừ trách nhiệm</Link> trước khi sử dụng nội dung từ website.
                </p>
            </article>
        </div>
    )
}
