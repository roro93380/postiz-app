'use client';

import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import Link from 'next/link';
import { Button } from '@gitroom/react/form/button';
import { Input } from '@gitroom/react/form/input';
import { useMemo, useState } from 'react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { LoginUserDto } from '@gitroom/nestjs-libraries/dtos/auth/login.user.dto';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
type Inputs = {
  email: string;
  password: string;
  providerToken: '';
  provider: 'LOCAL';
};
export function Login() {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [notActivated, setNotActivated] = useState(false);
  const resolver = useMemo(() => {
    return classValidatorResolver(LoginUserDto);
  }, []);
  const form = useForm<Inputs>({
    resolver,
    defaultValues: {
      providerToken: '',
      provider: 'LOCAL',
    },
  });
  const fetchData = useFetch();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    setNotActivated(false);
    try {
      const login = await fetchData('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          provider: 'LOCAL',
        }),
      });

      if (login.status === 400) {
        const errorMessage = await login.text();
        if (errorMessage === 'User is not activated') {
          setNotActivated(true);
        } else {
          form.setError('email', {
            message: errorMessage,
          });
        }
      }
    } catch {
      form.setError('email', {
        message: t(
          'server_unreachable',
          'Le serveur local est indisponible. Vérifie que le backend, PostgreSQL et Redis sont démarrés.'
        ),
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <FormProvider {...form}>
      <form className="flex-1 flex" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col flex-1">
          <div>
            <h1 className="text-[40px] font-[500] -tracking-[0.8px] text-start cursor-pointer">
              {t('sign_in', 'Connexion')}
            </h1>
          </div>
          <div className="flex flex-col mt-[32px]">
            <div className="flex flex-col gap-[12px]">
              <div className="text-textColor">
                <Input
                  label="Email"
                  translationKey="label_email"
                  {...form.register('email')}
                  type="email"
                  placeholder={t('email_address', 'Adresse email')}
                />
                <Input
                  label="Password"
                  translationKey="label_password"
                  {...form.register('password')}
                  autoComplete="off"
                  type="password"
                  placeholder={t('label_password', 'Mot de passe')}
                />
              </div>
              {notActivated && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-[10px] p-4 mb-4">
                  <p className="text-amber-400 text-sm mb-2">
                    {t(
                      'account_not_activated',
                      'Votre compte n\'est pas encore activé. Vérifiez votre boîte mail pour le lien d\'activation.'
                    )}
                  </p>
                  <Link
                    href="/auth/activate"
                    className="text-amber-400 underline hover:font-bold text-sm"
                  >
                    {t('resend_activation_email', 'Renvoyer l\'email d\'activation')}
                  </Link>
                </div>
              )}
              <div className="text-center mt-6">
                <div className="w-full flex">
                  <Button
                    type="submit"
                    className="flex-1 rounded-[10px] !h-[52px]"
                    loading={loading}
                  >
                    {t('sign_in_1', 'Se connecter')}
                  </Button>
                </div>
                <p className="mt-4 text-sm">
                  {t('don_t_have_an_account', 'Pas encore de compte ?')}&nbsp;
                  <Link href="/auth" className="underline cursor-pointer">
                    {t('sign_up', 'S\'inscrire')}
                  </Link>
                </p>
                <p className="mt-4 text-sm">
                  <Link
                    href="/auth/forgot"
                    className="underline hover:font-bold cursor-pointer"
                  >
                    {t('forgot_password', 'Mot de passe oublié')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
