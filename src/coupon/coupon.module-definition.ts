import { ConfigurableModuleBuilder } from "@nestjs/common";

export interface CouponModuleOptions {
    min: number,
    max: number,
}

// ConfigurableModuleClass缺省带有register&registerAsync方法,可以通过setClassMethodName修改方法名
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
    new ConfigurableModuleBuilder<CouponModuleOptions>().setClassMethodName('register').setExtras({
        isGlobal: true
        // definition即CouponModuleOptions
    }, (definition, extras) => ({
        ...definition,
        foobar: extras.isGlobal,
    })).build();