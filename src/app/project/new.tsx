import { errorMessage } from '@/utils/errors';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Screen from '@/components/Screen';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Chip from '@/components/Chip';
import SegmentedControl from '@/components/SegmentedControl';
import useForm, { type FormErrors } from '@/hooks/useForm';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useCurrentUser } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { authStyles } from '@/styles/auth.styles';
import { CATEGORIES, MODALIDADES } from '@/constants';
import { maskDate, maskNumber, maskPhone } from '@/utils/masks';
import { isPhone, isFutureOrToday, parseDateBR } from '@/utils/validators';
import { notify } from '@/utils/dialog';
import type { Modalidade } from '@/types';

type ProjectForm = {
  titulo: string;
  organizacao: string;
  categoria: string;
  modalidade: Modalidade;
  cidade: string;
  endereco: string;
  descricao: string;
  cargaHoraria: string;
  vagas: string;
  inicio: string;
  contato: string;
};

const validate = (v: ProjectForm): FormErrors<ProjectForm> => {
  const e: FormErrors<ProjectForm> = {};
  if (v.titulo.trim().length < 5) e.titulo = 'Dê um título com pelo menos 5 caracteres.';
  if (v.organizacao.trim().length < 3) e.organizacao = 'Informe a organização responsável.';
  if (v.modalidade !== 'Online' && v.cidade.trim().length < 3) {
    e.cidade = 'Informe a cidade onde as aulas acontecem.';
  }
  if (v.modalidade !== 'Online' && v.endereco.trim().length < 8) {
    e.endereco = 'Informe rua, número e bairro onde as aulas acontecem.';
  }
  if (v.descricao.trim().length < 30) e.descricao = 'Descreva o projeto com pelo menos 30 caracteres.';
  const carga = Number(v.cargaHoraria);
  if (!carga || carga < 1 || carga > 400) e.cargaHoraria = 'Informe de 1 a 400 horas.';
  const vagas = Number(v.vagas);
  if (!vagas || vagas < 1 || vagas > 500) e.vagas = 'Informe de 1 a 500 vagas.';
  const iso = parseDateBR(v.inicio);
  if (!iso) e.inicio = 'Data inválida. Use DD/MM/AAAA.';
  else if (!isFutureOrToday(iso)) e.inicio = 'A data de início não pode estar no passado.';
  if (!isPhone(v.contato)) e.contato = 'Informe um telefone de contato com DDD.';
  return e;
};

export default function CreateProjectScreen() {
  const router = useRouter();
  const s = useThemedStyles(authStyles);
  const user = useCurrentUser();
  const { createProject } = useData();
  const [loading, setLoading] = useState(false);
  const form = useForm<ProjectForm>(
    {
      titulo: '',
      organizacao: user.organizacao || '',
      categoria: CATEGORIES[0].key,
      modalidade: 'Online',
      cidade: '',
      endereco: '',
      descricao: '',
      cargaHoraria: '',
      vagas: '',
      inicio: '',
      contato: user.telefone || '',
    },
    validate
  );
  const v = form.values;

  const onSubmit = form.submit(async (values) => {
    setLoading(true);
    try {
      const project = await createProject({
        titulo: values.titulo.trim(),
        organizacao: values.organizacao.trim(),
        categoria: values.categoria,
        modalidade: values.modalidade,
        cidade: values.modalidade === 'Online' ? 'Online' : values.cidade.trim(),
        endereco: values.modalidade === 'Online' ? null : values.endereco.trim(),
        descricao: values.descricao.trim(),
        cargaHoraria: Number(values.cargaHoraria),
        vagas: Number(values.vagas),
        inicio: parseDateBR(values.inicio) ?? '',
        contato: values.contato,
        certificado: false,
        nivel: 'Iniciante',
        autorId: user.id,
        tags: [values.categoria],
      });
      notify('Projeto publicado! 🎉', 'Ele já aparece para os cidadãos na aba Projetos.');
      router.replace({ pathname: '/project/[id]', params: { id: project.id } });
    } catch (e) {
      notify('Não foi possível publicar', errorMessage(e));
      setLoading(false);
    }
  });

  return (
    <Screen scroll edges={['bottom']}>
      <Input
        label="Título do projeto"
        value={v.titulo}
        onChangeText={form.setField('titulo')}
        onBlur={form.blurField('titulo')}
        error={form.errors.titulo}
        placeholder="Ex.: Informática básica para jovens"
      />
      <Input
        label="Organização responsável"
        value={v.organizacao}
        onChangeText={form.setField('organizacao')}
        onBlur={form.blurField('organizacao')}
        error={form.errors.organizacao}
      />

      <Text style={s.sectionLabel}>Categoria</Text>
      <View style={s.chips}>
        {CATEGORIES.map((c) => (
          <Chip
            key={c.key}
            label={c.key}
            icon={c.icon}
            selected={v.categoria === c.key}
            onPress={() => form.setField('categoria')(c.key)}
          />
        ))}
      </View>

      <Text style={[s.sectionLabel, { marginTop: 8 }]}>Modalidade</Text>
      <SegmentedControl
        value={v.modalidade}
        onChange={form.setField('modalidade')}
        options={MODALIDADES.map((m) => ({ key: m, label: m }))}
      />

      {v.modalidade !== 'Online' ? (
        <>
          <Input
            label="Cidade"
            icon="location-outline"
            value={v.cidade}
            onChangeText={form.setField('cidade')}
            onBlur={form.blurField('cidade')}
            error={form.errors.cidade}
            placeholder="Ex.: Recife - PE"
          />
          <Input
            label="Endereço das aulas"
            icon="home-outline"
            value={v.endereco}
            onChangeText={form.setField('endereco')}
            onBlur={form.blurField('endereco')}
            error={form.errors.endereco}
            placeholder="Rua, número e bairro"
            autoCapitalize="words"
          />
        </>
      ) : null}

      <Input
        label="Descrição"
        value={v.descricao}
        onChangeText={form.setField('descricao')}
        onBlur={form.blurField('descricao')}
        error={form.errors.descricao}
        multiline
        maxLength={500}
        placeholder="O que será ensinado, para quem é e o que a pessoa leva ao final."
        hint={`${v.descricao.length}/500 caracteres`}
      />

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Input
            label="Carga horária"
            value={v.cargaHoraria}
            onChangeText={form.setField('cargaHoraria')}
            onBlur={form.blurField('cargaHoraria')}
            error={form.errors.cargaHoraria}
            mask={maskNumber(3)}
            keyboardType="number-pad"
            placeholder="Horas"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            label="Vagas"
            value={v.vagas}
            onChangeText={form.setField('vagas')}
            onBlur={form.blurField('vagas')}
            error={form.errors.vagas}
            mask={maskNumber(3)}
            keyboardType="number-pad"
            placeholder="Quantidade"
          />
        </View>
      </View>

      <Input
        label="Data de início"
        icon="calendar-outline"
        value={v.inicio}
        onChangeText={form.setField('inicio')}
        onBlur={form.blurField('inicio')}
        error={form.errors.inicio}
        mask={maskDate}
        keyboardType="number-pad"
        placeholder="DD/MM/AAAA"
      />
      <Input
        label="Telefone de contato"
        icon="call-outline"
        value={v.contato}
        onChangeText={form.setField('contato')}
        onBlur={form.blurField('contato')}
        error={form.errors.contato}
        mask={maskPhone}
        keyboardType="phone-pad"
        placeholder="(00) 00000-0000"
      />

      <Button title="Publicar projeto" icon="rocket-outline" onPress={onSubmit} loading={loading} />
    </Screen>
  );
}
