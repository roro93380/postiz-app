import { __awaiter } from "tslib";
import { getT } from "../../../../../../libraries/react-shared-libraries/src/translation/get.translation.service.backend";
export const dynamic = 'force-dynamic';
import loadDynamic from 'next/dynamic';
import { TestimonialComponent } from "../../../components/auth/testimonial.component";
import { LogoTextComponent } from "../../../components/ui/logo-text.component";
const ReturnUrlComponent = loadDynamic(() => import('./return.url.component'));
export default function AuthLayout(_a) {
    return __awaiter(this, arguments, void 0, function* ({ children, }) {
        const t = yield getT();
        return (<div className="bg-[#0d1117] flex flex-1 p-[12px] gap-[12px] min-h-screen w-screen text-white">
      {/*<style>{`html, body {overflow-x: hidden;}`}</style>*/}
      <ReturnUrlComponent />
      <div className="flex flex-col py-[40px] px-[20px] flex-1 lg:w-[600px] lg:flex-none rounded-[12px] text-white p-[12px] bg-[#161b22]">
        <div className="w-full max-w-[440px] mx-auto justify-center gap-[20px] h-full flex flex-col text-white">
          <LogoTextComponent />
          <div className="flex">{children}</div>
        </div>
      </div>
      <div className="text-[36px] flex-1 pt-[88px] hidden lg:flex flex-col items-center">
        <div className="text-center">
          Plus de <span className="text-[42px] text-[#00D4AA]">20,000+</span>{' '}
          Créateurs utilisent
          <br />
          roro tiktok pour développer leur présence
        </div>
        <TestimonialComponent />
      </div>
    </div>);
    });
}
//# sourceMappingURL=layout.js.map